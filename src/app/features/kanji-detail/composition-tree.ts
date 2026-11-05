import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { PartNode } from '../../core/kanji/kanji-composition';

/**
 * Cây cấu tạo của một chữ: chữ ở trên cùng, các thành phần toả xuống dưới, mỗi
 * thành phần lại toả tiếp xuống những gì ghép nên nó.
 *
 * Vẽ thành cây từ trên xuống chứ không thành đồ thị mũi tên trôi tự do: thứ tự
 * trái → phải của các nhánh chính là thứ tự viết trong dòng chiết tự (氵 rồi 骨),
 * nên đọc cây là đọc luôn được chữ được viết từ đâu sang đâu. Toàn là thẻ HTML và
 * link thường — bấm, Tab, trình đọc màn hình đều dùng được mà không cần thư viện vẽ.
 */
@Component({
  selector: 'app-composition-tree',
  imports: [NgTemplateOutlet, RouterLink],
  template: `
    <div class="tree-scroll">
      <ul class="tree">
        <ng-container *ngTemplateOutlet="branch; context: { $implicit: root(), isRoot: true }" />
      </ul>
    </div>

    <ng-template #branch let-node let-isRoot="isRoot">
      <li>
        @if (node.link && !isRoot) {
          <a
            class="node"
            [attr.data-kind]="node.kind"
            [routerLink]="node.link"
            [queryParamsHandling]="node.kind === 'kanji' ? 'preserve' : null"
            [attr.aria-label]="label(node)"
          >
            <span class="node-char jp" aria-hidden="true">{{ node.char }}</span>
            @if (node.hanViet) {
              <span class="node-han" aria-hidden="true">{{ node.hanViet }}</span>
            }
          </a>
        } @else {
          <span
            class="node"
            [class.is-root]="isRoot"
            [attr.data-kind]="node.kind"
            [attr.aria-label]="label(node)"
            role="img"
          >
            <span class="node-char jp" aria-hidden="true">{{ node.char }}</span>
            @if (node.hanViet) {
              <span class="node-han" aria-hidden="true">{{ node.hanViet }}</span>
            }
          </span>
        }

        @if (node.children.length > 0) {
          <ul>
            @for (child of node.children; track $index) {
              <ng-container *ngTemplateOutlet="branch; context: { $implicit: child, isRoot: false }" />
            }
          </ul>
        }
      </li>
    </ng-template>
  `,
  styles: `
    /* Cây rộng hơn khung (chữ bốn thành phần, mỗi thành phần lại tách đôi) thì cuộn
       ngang trong khung chứ không đẩy cả trang tràn ra ngoài màn hình. */
    .tree-scroll {
      overflow-x: auto;
      padding-bottom: var(--sp-2);
    }

    .tree {
      --line: var(--border-strong);
      --drop: 18px;
      display: flex;
      justify-content: center;
      width: max-content;
      min-width: 100%;
      margin: 0;
      padding: 0;
    }

    ul {
      display: flex;
      justify-content: center;
      position: relative;
      margin: 0;
      padding: var(--drop) 0 0;
    }

    li {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--drop) 5px 0;
      list-style: none;
    }

    /* Đường nối kiểu sơ đồ tổ chức: mỗi nhánh vẽ nửa thanh ngang về hai phía cộng
       một gạch đứng xuống chính nó; nhánh đầu và nhánh cuối cắt bớt nửa thừa. */
    li::before,
    li::after {
      content: '';
      position: absolute;
      top: 0;
      right: 50%;
      width: 50%;
      height: var(--drop);
      border-top: 1.5px solid var(--line);
    }

    li::after {
      right: auto;
      left: 50%;
      border-left: 1.5px solid var(--line);
    }

    li:only-child::before,
    li:only-child::after {
      border-top: 0;
    }

    li:first-child::before,
    li:last-child::after {
      border: 0;
    }

    li:last-child::before {
      border-right: 1.5px solid var(--line);
      border-top-right-radius: 8px;
    }

    li:first-child::after {
      border-top-left-radius: 8px;
    }

    li:only-child::before {
      border-right: 0;
    }

    /* Gạch đứng từ một nút xuống thanh ngang của các con nó. */
    ul ul::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      height: var(--drop);
      border-left: 1.5px solid var(--line);
    }

    /* Gốc không có cha nên không có đường nối nào phía trên. */
    .tree > li {
      padding-top: 0;
    }

    .tree > li::before,
    .tree > li::after {
      display: none;
    }

    .node {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1px;
      min-width: 58px;
      min-height: 58px;
      padding: 6px 8px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-subtle);
      color: var(--text);
      text-decoration: none;
      transition: border-color var(--dur) var(--ease), transform var(--dur) var(--ease),
        box-shadow var(--dur) var(--ease);
    }

    a.node:hover,
    a.node:focus-visible {
      border-color: var(--accent);
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
      text-decoration: none;
    }

    /* Màu nói thành phần là gì: chữ có trang riêng, bộ thủ, hay mảnh chỉ có âm. */
    .node[data-kind='kanji'] {
      border-color: color-mix(in srgb, var(--brand) 35%, var(--border));
      background: var(--brand-soft);
    }

    .node[data-kind='radical'] {
      border-color: var(--warning-border);
      background: var(--warning-soft);
    }

    .node.is-root {
      min-width: 76px;
      min-height: 76px;
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .node-char {
      font-size: 1.7rem;
      line-height: 1.1;
    }

    .is-root .node-char {
      font-size: 2.3rem;
    }

    .node-han {
      font-size: var(--fs-2xs);
      font-weight: 600;
      letter-spacing: 0.03em;
      color: var(--text-muted);
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      .tree {
        --drop: 14px;
      }

      li {
        padding-left: 3px;
        padding-right: 3px;
      }

      .node {
        min-width: 48px;
        min-height: 48px;
        padding: 4px 6px;
      }

      .node-char {
        font-size: 1.4rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionTree {
  private readonly lang = inject(LanguageStore);

  readonly root = input.required<PartNode>();

  /** "火 HỎA — bộ thủ": đọc lên được cả mặt chữ, âm và loại thành phần. */
  protected label(node: PartNode): string {
    const kind = this.lang.t(
      node.kind === 'kanji'
        ? 'kanji.parts.kind.kanji'
        : node.kind === 'radical'
          ? 'kanji.parts.kind.radical'
          : 'kanji.parts.kind.other',
    );
    return [node.char, node.hanViet, kind].filter(Boolean).join(' — ');
  }
}
