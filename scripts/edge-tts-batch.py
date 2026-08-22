#!/usr/bin/env python3
"""Doc mot danh sach cong viec TTS bang edge-tts va ghi ra file mp3.

Duoc goi boi scripts/generate-audio.mjs, khong dung truc tiep:

    python scripts/edge-tts-batch.py <jobs.json>

File jobs.json:
    {"voice": "ja-JP-NanamiNeural", "jobs": [{"text": "わたし", "out": "C:/.../abc.mp3"}, ...]}

Vi sao mot tien trinh cho ca lo thay vi goi CLI edge-tts moi tu mot lan: 1300 tu
la 1300 lan khoi dong Python (~0.3s moi lan) cong 1300 lan bat tay TLS. Gom lai
mot tien trinh, chay song song co gioi han, tong thoi gian con vai phut.

Ghi ra file tam roi moi doi ten: dung giua chung (Ctrl+C, mat mang) se de lai
file mp3 cut duoi 0 byte ma lan chay sau tuong la da xong.
"""

import asyncio
import json
import os
import sys

import edge_tts

# Ben dich chan so ket noi dong thoi; qua tay thi bi tra ve loi 403 hang loat.
CONCURRENCY = 6
ATTEMPTS = 3
# Duoi nguong nay chac chan la file hong: mot tu ngan nhat cung ra ~5KB.
MIN_BYTES = 1024


async def synthesize(text: str, out_path: str, voice: str) -> None:
    tmp_path = f"{out_path}.part"
    last_error = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(tmp_path)
            size = os.path.getsize(tmp_path)
            if size < MIN_BYTES:
                raise RuntimeError(f"file qua nho ({size} byte)")
            os.replace(tmp_path, out_path)
            return
        except Exception as error:  # noqa: BLE001 - loi mang thi thu lai, khong phan biet loai
            last_error = error
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            if attempt < ATTEMPTS:
                await asyncio.sleep(1.5 * attempt)
    raise RuntimeError(f"{text!r}: {last_error}")


async def main() -> int:
    if len(sys.argv) < 2:
        print("[LOI] thieu duong dan file cong viec", file=sys.stderr)
        return 2

    with open(sys.argv[1], "r", encoding="utf-8") as handle:
        payload = json.load(handle)

    voice = payload["voice"]
    jobs = payload["jobs"]
    total = len(jobs)
    if total == 0:
        return 0

    semaphore = asyncio.Semaphore(CONCURRENCY)
    done = 0
    failures: list[str] = []
    lock = asyncio.Lock()

    async def run(job: dict) -> None:
        nonlocal done
        async with semaphore:
            try:
                await synthesize(job["text"], job["out"], voice)
            except Exception as error:  # noqa: BLE001
                async with lock:
                    failures.append(str(error))
        async with lock:
            done += 1
            if done % 25 == 0 or done == total:
                print(f"  {done}/{total}", flush=True)

    await asyncio.gather(*(run(job) for job in jobs))

    for failure in failures:
        print(f"[LOI] {failure}", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
