import type { Lang } from './index';

const en = {
  site: { name: 'DGTool', homeAria: 'DGTool home', logoAlt: 'dgtool.io', about: 'About', privacy: 'Privacy policy', terms: 'Terms', language: 'Language' },
  nav: { home: 'Home' },
  home: {
    title: 'DGTool – Free Online Tools That Run in Your Browser',
    description: 'Free online tools that run in your browser. Your files never leave your device.',
    h1: 'Free tools that stay on your device',
    lead: 'Pick a tool. Files are processed in your browser and never uploaded.',
  },
  categories: {
    image: {
      title: 'Image tools',
      metaTitle: 'Free Image Tools – Private, No Upload | DGTool',
      blurb: 'Convert and compress images privately, right in your browser.',
    },
  },
  content: { howToConvert: 'How to convert {name}', howToCompress: 'How to compress images', faq: 'Frequently asked questions', related: 'Related tools' },
  common: { download: 'Download', downloadAll: 'Download all', clear: 'Clear list', waiting: 'Waiting…' },
  converter: {
    dropTitle: 'Choose files or drop them here',
    dropSub: 'You can select several at once',
    jpgQuality: 'JPG quality',
    converting: 'Converting…',
    done: 'Done · {from} → {to}',
    failed: 'Could not convert this file. Check that it is a valid image of the right type.',
  },
  compressor: {
    dropTitle: 'Choose images or drop them here',
    dropSub: 'JPG, PNG or WebP · you can select several at once',
    quality: 'Quality',
    longestSide: 'Longest side',
    original: 'Original',
    format: 'Format',
    formatSame: 'Same as original',
    hint: 'PNG is compressed by reducing its colors, and Quality sets how many are kept. For photos, WebP or JPG gives much smaller files. JPG fills transparent areas with white.',
    compressing: 'Compressing…',
    unsupported: 'Unsupported file. Please use JPG, PNG or WebP.',
    kept: 'Already well compressed · kept the original ({size})',
    done: 'Done · {before} → {after} ({sign}{pct}%)',
    failed: 'Could not compress this file. Check that it is a valid JPG, PNG or WebP image.',
    summarySavedOne: 'Saved {saved} (−{pct}%) across {n} image',
    summarySavedMany: 'Saved {saved} (−{pct}%) across {n} images',
    summaryNone: 'No size reduction with these settings. Try a lower quality or a smaller size.',
    noteWebp: 'This browser cannot save WebP, so the image was saved as JPG.',
    detailColors: '{n} colors',
    detailLossless: '{n} colors, no visible change',
  },
};

export type UI = typeof en;

const zhTw: UI = {
  site: { name: 'DGTool', homeAria: 'DGTool 首頁', logoAlt: 'dgtool.io', about: '關於', privacy: '隱私權政策', terms: '使用條款', language: '語言' },
  nav: { home: '首頁' },
  home: {
    title: 'DGTool – 在瀏覽器中執行的免費線上工具',
    description: '在瀏覽器中執行的免費線上工具，你的檔案不會離開你的裝置。',
    h1: '檔案留在你的裝置上的免費工具',
    lead: '選擇一個工具。檔案在瀏覽器中處理，不會上傳。',
  },
  categories: {
    image: {
      title: '圖片工具',
      metaTitle: '免費圖片工具 – 保護隱私、不需上傳 | DGTool',
      blurb: '在瀏覽器中私密地轉換與壓縮圖片。',
    },
  },
  content: { howToConvert: '如何使用 {name}', howToCompress: '如何壓縮圖片', faq: '常見問題', related: '相關工具' },
  common: { download: '下載', downloadAll: '全部下載', clear: '清除清單', waiting: '等待中…' },
  converter: {
    dropTitle: '選擇檔案或拖曳到這裡',
    dropSub: '可以一次選擇多個檔案',
    jpgQuality: 'JPG 品質',
    converting: '轉換中…',
    done: '完成 · {from} → {to}',
    failed: '無法轉換這個檔案。請確認它是正確類型的有效圖片。',
  },
  compressor: {
    dropTitle: '選擇圖片或拖曳到這裡',
    dropSub: 'JPG、PNG 或 WebP · 可以一次選擇多張',
    quality: '品質',
    longestSide: '最長邊',
    original: '原始大小',
    format: '格式',
    formatSame: '與原檔相同',
    hint: 'PNG 透過減少顏色數量來壓縮，「品質」決定保留多少種顏色。照片建議改用 WebP 或 JPG，檔案會小很多。JPG 會把透明區域填成白色。',
    compressing: '壓縮中…',
    unsupported: '不支援這個檔案。請使用 JPG、PNG 或 WebP。',
    kept: '已經壓縮得很好 · 保留原檔（{size}）',
    done: '完成 · {before} → {after}（{sign}{pct}%）',
    failed: '無法壓縮這個檔案。請確認它是有效的 JPG、PNG 或 WebP 圖片。',
    summarySavedOne: '共節省 {saved}（−{pct}%），處理 {n} 張圖片',
    summarySavedMany: '共節省 {saved}（−{pct}%），處理 {n} 張圖片',
    summaryNone: '使用目前的設定沒有縮小檔案。請試試降低品質或縮小尺寸。',
    noteWebp: '這個瀏覽器無法儲存 WebP，已改存成 JPG。',
    detailColors: '{n} 色',
    detailLossless: '{n} 色，畫面無差異',
  },
};

export const ui: Record<Lang, UI> = { en, 'zh-tw': zhTw };
