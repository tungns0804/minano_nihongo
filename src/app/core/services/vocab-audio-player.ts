import { Injectable, signal } from '@angular/core';

import {
  VOCAB_AUDIO_PATH,
  audioFileOfWord,
  speechTextOf,
} from '../audio/vocab-audio';
import type { VocabularyWord } from '../models/vocabulary.model';

/** Tên file cuối đường dẫn, ví dụ ".../audio/vocab/abc.mp3" -> "abc.mp3". */
function fileNameOf(url: string): string {
  return url.split('/').pop() ?? '';
}

/** Ghép đường dẫn tài nguyên theo <base href>, giống `LessonStore`. */
function assetUrl(path: string): string {
  const base = typeof document !== 'undefined' && document.baseURI ? document.baseURI : '/';
  return new URL(path, base).href;
}

/**
 * Phát file mp3 phát âm của từ vựng (do `npm run generate:audio` sinh bằng edge-tts).
 *
 * Vì sao dùng file thu sẵn chứ không dùng `speechSynthesis` của trình duyệt: giọng
 * đọc tiếng Nhật của Web Speech API phụ thuộc hoàn toàn vào máy người học — Windows
 * không cài gói tiếng Nhật thì không có giọng nào, Android mỗi hãng một kiểu, và
 * cùng một từ nghe mỗi máy một khác. Từ vựng là thứ người ta học thuộc bằng tai, nên
 * âm phải giống hệt nhau ở mọi máy.
 *
 * Toàn app dùng CHUNG một thẻ <audio>: bấm từ mới thì từ đang đọc dở dừng ngay, không
 * bao giờ có hai từ chồng tiếng lên nhau.
 */
@Injectable({ providedIn: 'root' })
export class VocabAudioPlayer {
  /**
   * Bản offline (`npm run build:offline`) là MỘT file HTML mở bằng file:// — không có
   * thư mục audio đi kèm, và file:// cũng chặn tải tài nguyên ngoài. Tắt hẳn tính năng
   * ở đó để không bày ra một cái nút bấm vào chỉ báo lỗi.
   */
  readonly available =
    typeof Audio !== 'undefined' &&
    !(typeof location !== 'undefined' && location.protocol === 'file:');

  /** Tên file đang phát, để nút tương ứng tự sáng lên. */
  readonly playingFile = signal<string | null>(null);

  /** Những file tải hỏng (chưa sinh, hoặc mạng lỗi) — nút của chúng chuyển sang mờ. */
  readonly brokenFiles = signal<ReadonlySet<string>>(new Set());

  private element: HTMLAudioElement | null = null;

  /** Từ này có phát âm để bấm hay không. */
  canPlay(word: VocabularyWord): boolean {
    return this.available && speechTextOf(word).length > 0;
  }

  isPlaying(word: VocabularyWord): boolean {
    const file = audioFileOfWord(word);
    return file !== null && this.playingFile() === file;
  }

  isBroken(word: VocabularyWord): boolean {
    const file = audioFileOfWord(word);
    return file !== null && this.brokenFiles().has(file);
  }

  /** Đọc một từ. Bấm lại đúng từ đang đọc thì dừng. */
  play(word: VocabularyWord): void {
    if (!this.available) return;
    const file = audioFileOfWord(word);
    if (file === null) return;

    if (this.playingFile() === file) {
      this.stop();
      return;
    }

    const element = this.ensureElement();
    element.src = assetUrl(`${VOCAB_AUDIO_PATH}${file}`);
    this.playingFile.set(file);

    // Chrome/Safari từ chối phát khi chưa có thao tác người dùng nào, và file có thể
    // chưa được sinh. Cả hai đều phải im lặng chuyển nút sang trạng thái hỏng chứ
    // không được ném lỗi ra ngoài làm sập chỗ gọi.
    void element.play().catch(() => this.markBroken(file));
  }

  stop(): void {
    this.playingFile.set(null);
    if (this.element === null) return;
    this.element.pause();
    this.element.currentTime = 0;
  }

  private ensureElement(): HTMLAudioElement {
    if (this.element !== null) return this.element;

    const element = new Audio();
    element.preload = 'none';
    element.addEventListener('ended', () => this.playingFile.set(null));
    // Đọc tên file từ chính thẻ <audio> chứ không lấy `playingFile()`: bấm nhanh hai
    // từ liền nhau thì lúc lỗi của từ trước bay về, `playingFile` đã là từ sau rồi —
    // đánh dấu hỏng theo nó là bôi đen nhầm một nút vẫn chạy tốt.
    element.addEventListener('error', () => {
      const file = fileNameOf(element.currentSrc || element.src);
      if (file.length > 0) this.markBroken(file);
    });
    this.element = element;
    return element;
  }

  private markBroken(file: string): void {
    this.brokenFiles.update((files) => new Set(files).add(file));
    if (this.playingFile() === file) this.playingFile.set(null);
  }
}
