// About, privacy policy and terms of use, per language.
// Paragraphs are HTML. {home}, {image} and {privacy} become language-aware links.
import type { Lang } from './index';

export type PageKey = 'about' | 'privacy' | 'terms';
export interface PageDoc {
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: { h: string; p: string[] }[];
}

export const pages: Record<Lang, Record<PageKey, PageDoc>> = {
  en: {
  "about": {
    "title": "About DGTool",
    "description": "DGTool offers free online tools that run in your browser, so your files stay on your device.",
    "h1": "About DGTool",
    "lead": "Free online tools that work in your browser and keep your files on your device.",
    "sections": [
      {
        "h": "What DGTool is",
        "p": [
          "DGTool is an independent project that builds simple, free tools for everyday tasks. Tools so far include image format conversion, such as turning iPhone HEIC photos into JPG or PNG and WebP images into JPG or PNG, image compression, resizing, watermarking and background removal. More tools are added over time."
        ]
      },
      {
        "h": "Why it is different",
        "p": [
          "Many online converters ask you to upload your files to a server. DGTool does the work inside your own browser instead. Your photos are not sent to us, which makes the tools faster for many files and keeps your pictures private."
        ]
      },
      {
        "h": "How it works",
        "p": [
          "When you pick a file, a small program on the page reads it and converts it on your device. When it finishes, you download the result straight from your browser. There is no sign-up and no file limit, and DGTool never adds its own watermark to your output images."
        ]
      },
      {
        "h": "How the site is supported",
        "p": [
          "DGTool is free to use. To cover hosting and development, the site may show advertising. You can read how advertising and cookies are handled in our <a href=\"{privacy}\">privacy policy</a>."
        ]
      },
      {
        "h": "Tools available now",
        "p": [
          "Browse the <a href=\"{image}\">image tools</a>, or go back to the <a href=\"{home}\">home page</a> to see everything."
        ]
      },
      {
        "h": "Open-source components",
        "p": [
          "DGTool is built with open-source software. HEIC decoding uses <a href=\"https://github.com/alexcorvi/heic2any\" target=\"_blank\" rel=\"noopener\">heic2any</a> (MIT License, Copyright (c) 2020 Alex Corvi), which includes <a href=\"https://github.com/strukturag/libheif\" target=\"_blank\" rel=\"noopener\">libheif</a> and its related codec libraries. libheif is licensed under the GNU Lesser General Public License (LGPL); the source code and the exact license terms are available from the libheif project.",
          "AI background removal uses the <a href=\"https://github.com/xuebinqin/U-2-Net\" target=\"_blank\" rel=\"noopener\">U²-Net</a> model by Xuebin Qin and others (Apache License 2.0) and <a href=\"https://github.com/microsoft/onnxruntime\" target=\"_blank\" rel=\"noopener\">ONNX Runtime Web</a> by Microsoft (MIT License)."
        ]
      },
      {
        "h": "Contact",
        "p": [
          "Questions, bug reports or tool suggestions are welcome at <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>."
        ]
      }
    ]
  },
  "privacy": {
    "title": "Privacy Policy | DGTool",
    "description": "How DGTool handles your files, cookies, advertising and personal data.",
    "h1": "Privacy policy",
    "lead": "Last updated: November 1, 2026",
    "sections": [
      {
        "h": "Your files stay on your device",
        "p": [
          "DGTool's converters run inside your web browser. When you choose an image, it is processed on your own device and is not uploaded to our servers. We cannot see, store or share the files you convert."
        ]
      },
      {
        "h": "Information we collect",
        "p": [
          "We do not require an account and we do not ask for your name, email address or other personal details to use the tools. Like most websites, our hosting and security provider, Cloudflare, may automatically process technical information such as your IP address, browser type, requested pages and the date and time of each request. This is used to deliver the site, keep it secure and prevent abuse."
        ]
      },
      {
        "h": "Cookies",
        "p": [
          "The site itself does not set cookies to track you. Cloudflare may set strictly necessary cookies for security purposes. If we show advertising or add analytics (see below), those services may set their own cookies, and we will update this page when that happens."
        ]
      },
      {
        "h": "Advertising",
        "p": [
          "DGTool is free to use and may be supported by advertising. Advertising partners, such as Google, may use cookies or similar technologies to show ads and measure their performance, and may use information about your visits to this and other websites to show relevant ads. Where required by law, such as in the European Economic Area and the United Kingdom, we will ask for your consent before personalised advertising cookies are used.",
          "You can manage personalised advertising through Google's Ads Settings, or opt out through the industry tools at youradchoices.com and aboutads.info. You can also block or delete cookies in your browser settings."
        ]
      },
      {
        "h": "Third-party services",
        "p": [
          "This site is hosted and delivered through Cloudflare. Web fonts are loaded from Google Fonts, which means your browser may contact Google's servers to download the font files. These providers have their own privacy policies. The optional AI background removal downloads a small AI model (U²-Net, Apache-2.0 license) from this site. It then runs on your device and your images are not uploaded."
        ]
      },
      {
        "h": "Your rights",
        "p": [
          "Depending on where you live, you may have rights over personal data held about you, such as access, correction, deletion or objection to processing. Because we do not collect account information, we hold very little data about individual visitors. To make a request or ask a question, contact us using the details below."
        ]
      },
      {
        "h": "Children",
        "p": [
          "DGTool is not directed at children under 13, and we do not knowingly collect personal information from them."
        ]
      },
      {
        "h": "Changes to this policy",
        "p": [
          "We may update this policy from time to time. The date at the top of the page shows when it was last changed."
        ]
      },
      {
        "h": "Contact",
        "p": [
          "Questions about this policy can be sent to <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>."
        ]
      }
    ]
  },
  "terms": {
    "title": "Terms of Use | DGTool",
    "description": "The terms that apply when you use DGTool's free online tools.",
    "h1": "Terms of use",
    "lead": "Last updated: October 17, 2026",
    "sections": [
      {
        "h": "Acceptance of these terms",
        "p": [
          "By using DGTool, you agree to these terms. If you do not agree, please do not use the site."
        ]
      },
      {
        "h": "What the service does",
        "p": [
          "DGTool provides free tools that process files in your web browser. We may add, change or remove tools at any time without notice."
        ]
      },
      {
        "h": "Your files",
        "p": [
          "You keep all rights to the files you convert. Files are processed on your own device and are not uploaded to our servers. You are responsible for making sure you have the right to use and convert the files you choose."
        ]
      },
      {
        "h": "Acceptable use",
        "p": [
          "You agree not to use the site to break the law, to infringe the rights of others, or to interfere with or attempt to disrupt the site or its hosting. You also agree not to copy or resell the site's tools or content in a way that misrepresents their source."
        ]
      },
      {
        "h": "No warranty",
        "p": [
          "The tools are provided \"as is\" and \"as available\", without warranties of any kind. We do not guarantee that conversions will be error-free, that output quality will meet your needs, or that the site will always be available. Please keep a copy of your original files, and check the results before relying on them."
        ]
      },
      {
        "h": "Limitation of liability",
        "p": [
          "To the extent permitted by law, DGTool and its owner are not liable for any loss or damage arising from your use of the site, including lost or corrupted files or lost data. Nothing in these terms limits any rights you have that cannot be limited by law."
        ]
      },
      {
        "h": "Advertising and third-party services",
        "p": [
          "The site may show advertising and uses third-party services such as Cloudflare and Google Fonts. We are not responsible for the content or practices of third parties. See the <a href=\"{privacy}\">privacy policy</a> for details."
        ]
      },
      {
        "h": "Changes to these terms",
        "p": [
          "We may update these terms from time to time. Continuing to use the site after a change means you accept the updated terms. The date at the top shows when they were last changed."
        ]
      },
      {
        "h": "Contact",
        "p": [
          "Questions about these terms can be sent to <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>."
        ]
      }
    ]
  }
},
  'zh-tw': {
  "about": {
    "title": "關於 DGTool",
    "description": "DGTool 提供在瀏覽器中執行的免費線上工具，讓你的檔案留在自己的裝置上。",
    "h1": "關於 DGTool",
    "lead": "在瀏覽器中運作的免費線上工具，讓你的檔案留在自己的裝置上。",
    "sections": [
      {
        "h": "什麼是 DGTool",
        "p": [
          "DGTool 是一個獨立專案，製作簡單、免費的工具，處理日常會遇到的小工作。目前的工具包括圖片格式轉換，例如把 iPhone 的 HEIC 照片轉成 JPG 或 PNG、把 WebP 圖片轉成 JPG 或 PNG，以及圖片壓縮、縮放、浮水印與去背。未來會陸續增加更多工具。"
        ]
      },
      {
        "h": "有什麼不一樣",
        "p": [
          "許多線上轉檔網站會要求你把檔案上傳到伺服器。DGTool 則是直接在你自己的瀏覽器裡完成工作。你的照片不會傳送給我們，處理大量檔案時速度通常更快，圖片也能保有隱私。"
        ]
      },
      {
        "h": "運作方式",
        "p": [
          "選擇檔案之後，頁面上的一小段程式會在你的裝置上讀取並轉換它。完成後，你可以直接從瀏覽器下載結果。不需要註冊，沒有檔案數量限制，輸出的圖片也不會被自動加上 DGTool 的浮水印。"
        ]
      },
      {
        "h": "網站如何維持運作",
        "p": [
          "DGTool 可以免費使用。為了支付主機和開發成本，網站可能會顯示廣告。你可以在<a href=\"{privacy}\">隱私權政策</a>中了解廣告與 Cookie 的處理方式。"
        ]
      },
      {
        "h": "目前提供的工具",
        "p": [
          "瀏覽<a href=\"{image}\">圖片工具</a>，或回到<a href=\"{home}\">首頁</a>查看所有工具。"
        ]
      },
      {
        "h": "開源元件",
        "p": [
          "DGTool 使用開源軟體製作。HEIC 解碼使用 <a href=\"https://github.com/alexcorvi/heic2any\" target=\"_blank\" rel=\"noopener\">heic2any</a>（MIT 授權，Copyright (c) 2020 Alex Corvi），它內含 <a href=\"https://github.com/strukturag/libheif\" target=\"_blank\" rel=\"noopener\">libheif</a> 及相關的編解碼函式庫。libheif 採用 GNU Lesser General Public License（LGPL）授權，原始碼與完整授權條款可在 libheif 專案取得。",
          "AI 去背使用 Xuebin Qin 等人的 <a href=\"https://github.com/xuebinqin/U-2-Net\" target=\"_blank\" rel=\"noopener\">U²-Net</a> 模型（Apache License 2.0），以及 Microsoft 的 <a href=\"https://github.com/microsoft/onnxruntime\" target=\"_blank\" rel=\"noopener\">ONNX Runtime Web</a>（MIT 授權）。"
        ]
      },
      {
        "h": "聯絡我們",
        "p": [
          "歡迎透過 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a> 提出問題、回報錯誤或建議新工具。"
        ]
      }
    ]
  },
  "privacy": {
    "title": "隱私權政策 | DGTool",
    "description": "說明 DGTool 如何處理你的檔案、Cookie、廣告與個人資料。",
    "h1": "隱私權政策",
    "lead": "最後更新：2026 年 11 月 1 日",
    "sections": [
      {
        "h": "你的檔案留在你的裝置上",
        "p": [
          "DGTool 的轉換工具在你的網頁瀏覽器中執行。你選擇圖片後，圖片會在你自己的裝置上處理，不會上傳到我們的伺服器。我們看不到、也不會儲存或分享你轉換的檔案。"
        ]
      },
      {
        "h": "我們蒐集的資訊",
        "p": [
          "使用本站不需要註冊帳號，我們也不會要求你提供姓名、電子郵件地址或其他個人資料。和大多數網站一樣，我們的主機與安全服務供應商 Cloudflare 可能會自動處理一些技術資訊，例如你的 IP 位址、瀏覽器類型、所要求的頁面，以及每次請求的日期和時間。這些資訊用於提供網站、維護安全和防止濫用。"
        ]
      },
      {
        "h": "Cookie",
        "p": [
          "本站本身不會設定用來追蹤你的 Cookie。Cloudflare 可能為了安全目的設定必要的 Cookie。如果我們日後顯示廣告或加入分析工具（見下方說明），這些服務可能會設定它們自己的 Cookie，屆時我們會更新本頁。"
        ]
      },
      {
        "h": "廣告",
        "p": [
          "DGTool 可以免費使用，並可能以廣告維持運作。廣告合作夥伴，例如 Google，可能會使用 Cookie 或類似技術來顯示廣告並衡量廣告成效，也可能利用你造訪本站和其他網站的資訊，來顯示相關的廣告。依法律要求的地區，例如歐洲經濟區和英國，在使用個人化廣告 Cookie 之前，我們會先徵求你的同意。",
          "你可以透過 Google 的廣告設定管理個人化廣告，或透過 youradchoices.com 和 aboutads.info 的產業工具選擇退出。你也可以在瀏覽器設定中封鎖或刪除 Cookie。"
        ]
      },
      {
        "h": "第三方服務",
        "p": [
          "本站透過 Cloudflare 託管與傳送。網頁字型從 Google Fonts 載入，這表示你的瀏覽器可能會連線到 Google 的伺服器下載字型檔。這些供應商各有自己的隱私權政策。 選用的 AI 去背功能會從本站下載一個小型 AI 模型（U²-Net，Apache-2.0 授權），之後在你的裝置上執行，圖片不會被上傳。"
        ]
      },
      {
        "h": "你的權利",
        "p": [
          "依你居住的地區，你可能對自己的個人資料擁有一些權利，例如查詢、更正、刪除，或反對處理。由於我們不蒐集帳號資訊，我們持有的個別訪客資料非常少。如需提出請求或詢問問題，請使用下方的聯絡方式與我們聯繫。"
        ]
      },
      {
        "h": "兒童",
        "p": [
          "DGTool 不是針對 13 歲以下兒童設計的，我們也不會刻意蒐集他們的個人資料。"
        ]
      },
      {
        "h": "本政策的變更",
        "p": [
          "我們可能會不定期更新本政策。頁面頂端的日期會顯示最後一次修改的時間。"
        ]
      },
      {
        "h": "聯絡方式",
        "p": [
          "對本政策有任何問題，請寄到 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>。"
        ]
      }
    ]
  },
  "terms": {
    "title": "使用條款 | DGTool",
    "description": "使用 DGTool 免費線上工具時適用的條款。",
    "h1": "使用條款",
    "lead": "最後更新：2026 年 10 月 17 日",
    "sections": [
      {
        "h": "接受條款",
        "p": [
          "使用 DGTool 即表示你同意這些條款。如果你不同意，請不要使用本站。"
        ]
      },
      {
        "h": "服務內容",
        "p": [
          "DGTool 提供在你的網頁瀏覽器中處理檔案的免費工具。我們可能隨時新增、變更或移除工具，恕不另行通知。"
        ]
      },
      {
        "h": "你的檔案",
        "p": [
          "你對自己轉換的檔案保有所有權利。檔案在你自己的裝置上處理，不會上傳到我們的伺服器。你有責任確保自己有權使用並轉換你所選擇的檔案。"
        ]
      },
      {
        "h": "可接受的使用方式",
        "p": [
          "你同意不會利用本站從事違法行為、侵害他人權利，或干擾、試圖破壞本站或其主機服務。你也同意不會以誤導來源的方式，複製或轉售本站的工具或內容。"
        ]
      },
      {
        "h": "不提供保證",
        "p": [
          "這些工具依「現狀」及「可用狀態」提供，不附帶任何形式的保證。我們不保證轉換結果沒有錯誤、輸出的品質符合你的需求，或網站隨時都可使用。請保留你的原始檔案，並在依賴結果之前先檢查。"
        ]
      },
      {
        "h": "責任限制",
        "p": [
          "在法律允許的範圍內，DGTool 及其擁有者對於因你使用本站而產生的任何損失或損害不負責任，包括檔案遺失或損毀，或資料遺失。本條款中沒有任何內容會限制法律規定無法限制的你的權利。"
        ]
      },
      {
        "h": "廣告與第三方服務",
        "p": [
          "本站可能顯示廣告，並使用 Cloudflare 和 Google Fonts 等第三方服務。我們不對第三方的內容或做法負責。詳情請參閱<a href=\"{privacy}\">隱私權政策</a>。"
        ]
      },
      {
        "h": "條款的變更",
        "p": [
          "我們可能會不定期更新這些條款。在條款變更之後繼續使用本站，即表示你接受更新後的條款。頁面頂端的日期顯示最後一次修改的時間。"
        ]
      },
      {
        "h": "聯絡方式",
        "p": [
          "對這些條款有任何問題，請寄到 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>。"
        ]
      }
    ]
  }
},
  ja: {
    "about": {
      "title": "DGTool について",
      "description": "DGTool は、ブラウザ上で動作する無料のオンラインツールを提供します。ファイルはお使いのデバイスに残ります。",
      "h1": "DGTool について",
      "lead": "ブラウザ上で動作し、ファイルをサーバーにアップロードせずに利用できる無料のオンラインツールです。",
      "sections": [
        {
          "h": "DGTool とは",
          "p": [
            "DGTool は、日常のちょっとした作業のための、シンプルで無料のツールを開発・提供している個人プロジェクトです。現在は、iPhone の HEIC 写真や WebP 画像の JPG・PNG 変換、画像の圧縮、リサイズ、透かしの追加、背景の削除などのツールを提供しています。今後もツールを追加していきます。"
          ]
        },
        {
          "h": "DGTool の特長",
          "p": [
            "多くのオンライン変換サイトは、ファイルをサーバーにアップロードするよう求めます。DGTool は、お使いのブラウザの中で処理を行います。画像が当サイトのサーバーに送信されることはなく、アップロードの待ち時間を省けるうえ、画像のプライバシーも守られます。"
          ]
        },
        {
          "h": "しくみ",
          "p": [
            "ファイルを選ぶと、ブラウザ内のプログラムがお使いのデバイス上でそれを読み込み、処理します。完了したら、ブラウザから結果をそのままダウンロードできます。会員登録は不要で、処理するファイル数に制限はありません。出力画像に DGTool の透かしが自動で追加されることもありません。"
          ]
        },
        {
          "h": "サイトの運営について",
          "p": [
            "DGTool は無料でご利用いただけます。ホスティングと開発の費用をまかなうため、サイトに広告を表示することがあります。広告と Cookie の扱いについては、<a href=\"{privacy}\">プライバシーポリシー</a>をご覧ください。"
          ]
        },
        {
          "h": "現在のツール",
          "p": [
            "<a href=\"{image}\">画像ツール</a>をご覧になるか、<a href=\"{home}\">ホーム</a>に戻ってすべてのツールをご覧ください。"
          ]
        },
        {
          "h": "オープンソースのコンポーネント",
          "p": [
            "DGTool はオープンソースソフトウェアを利用しています。HEIC のデコードには <a href=\"https://github.com/alexcorvi/heic2any\" target=\"_blank\" rel=\"noopener\">heic2any</a>（MIT ライセンス、Copyright (c) 2020 Alex Corvi）を使用しており、これには <a href=\"https://github.com/strukturag/libheif\" target=\"_blank\" rel=\"noopener\">libheif</a> と関連するコーデックライブラリが含まれます。libheif は GNU Lesser General Public License（LGPL）で提供されており、ソースコードと詳細なライセンス条件は libheif プロジェクトで入手できます。",
            "AI による背景削除には、Xuebin Qin らの <a href=\"https://github.com/xuebinqin/U-2-Net\" target=\"_blank\" rel=\"noopener\">U²-Net</a> モデル（Apache License 2.0）と、Microsoft の <a href=\"https://github.com/microsoft/onnxruntime\" target=\"_blank\" rel=\"noopener\">ONNX Runtime Web</a>（MIT ライセンス）を使用しています。"
          ]
        },
        {
          "h": "お問い合わせ",
          "p": [
            "ご質問、不具合の報告、ツールのご提案は <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a> までお気軽にお寄せください。"
          ]
        }
      ]
    },
    "privacy": {
      "title": "プライバシーポリシー | DGTool",
      "description": "DGTool がファイル、Cookie、広告、個人データをどのように扱うかについて説明します。",
      "h1": "プライバシーポリシー",
      "lead": "最終更新日：2026 年 11 月 1 日",
      "sections": [
        {
          "h": "ファイルはお使いのデバイスに残ります",
          "p": [
            "DGTool の画像処理ツールは、お使いのウェブブラウザの中で動作します。選択した画像はお使いのデバイス上で処理され、当サイトのサーバーにアップロードされることはありません。当サイトは、変換されるファイルを閲覧することも、保存することも、共有することもできません。"
          ]
        },
        {
          "h": "収集する情報",
          "p": [
            "ご利用にあたってアカウントは必要なく、お名前、メールアドレス、その他の個人情報の入力を求めることもありません。多くのウェブサイトと同様に、当サイトのホスティングおよびセキュリティの提供元である Cloudflare が、IP アドレス、ブラウザの種類、アクセス先のページ、各リクエストの日時などの技術的な情報を自動的に処理することがあります。これらは、サイトの提供、セキュリティの維持、不正利用の防止に使われます。"
          ]
        },
        {
          "h": "Cookie",
          "p": [
            "当サイト自体が、お客様を追跡するための Cookie を設定することはありません。Cloudflare が、セキュリティ目的で必要な Cookie を設定することがあります。今後、広告を表示したり分析ツールを追加したりする場合（下記参照）、それらのサービスが独自の Cookie を設定することがあり、その際は本ページを更新します。"
          ]
        },
        {
          "h": "広告",
          "p": [
            "DGTool は無料でご利用いただけ、広告収入を運営費に充てる場合があります。Google などの広告パートナーは、広告の表示や効果の測定のために Cookie や類似の技術を使用することがあり、当サイトやほかのウェブサイトへのご訪問に関する情報を、関連性の高い広告の表示に利用することがあります。欧州経済領域や英国など、法律で求められている地域では、パーソナライズ広告に使用する Cookie を設定する前に、同意を求めます。",
            "パーソナライズ広告は、Google の広告設定で管理できるほか、youradchoices.com や aboutads.info の業界ツールでオプトアウトすることもできます。ブラウザの設定で Cookie をブロックまたは削除することも可能です。"
          ]
        },
        {
          "h": "第三者のサービス",
          "p": [
            "当サイトは Cloudflare を通じてホスティングおよび配信されています。Google Fonts からウェブフォントを読み込む際に、お使いのブラウザが Google のサーバーに接続することがあります。これらの提供元には、それぞれ独自のプライバシーポリシーがあります。AI による背景削除機能を利用する場合は、当サイトから小さな AI モデル（U²-Net、Apache-2.0 ライセンス）をダウンロードします。その後はお使いのデバイス上で動作し、画像はアップロードされません。"
          ]
        },
        {
          "h": "お客様の権利",
          "p": [
            "お住まいの地域によっては、ご自身の個人データについて、アクセス、訂正、削除、処理への異議申し立てなどの権利がある場合があります。当サイトはアカウント情報を収集しないため、個々の訪問者について保有しているデータはごくわずかです。権利行使に関するご請求やお問い合わせは、以下の連絡先までお寄せください。"
          ]
        },
        {
          "h": "お子様の個人情報について",
          "p": [
            "DGTool は 13 歳未満のお子様を対象としておらず、お子様の個人情報を意図的に収集することもありません。"
          ]
        },
        {
          "h": "本ポリシーの変更",
          "p": [
            "本ポリシーは随時更新されることがあります。ページ上部の日付は、最後に変更された日を示しています。"
          ]
        },
        {
          "h": "お問い合わせ",
          "p": [
            "本ポリシーに関するご質問は、<a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a> までお送りください。"
          ]
        }
      ]
    },
    "terms": {
      "title": "利用規約 | DGTool",
      "description": "DGTool の無料オンラインツールをご利用いただく際に適用される規約です。",
      "h1": "利用規約",
      "lead": "最終更新日：2026 年 10 月 17 日",
      "sections": [
        {
          "h": "規約への同意",
          "p": [
            "DGTool をご利用になることで、本規約に同意したものとみなされます。同意されない場合は、当サイトをご利用にならないでください。"
          ]
        },
        {
          "h": "サービスの内容",
          "p": [
            "DGTool は、お使いのウェブブラウザ上でファイルを処理する無料のツールを提供します。ツールの追加・変更・提供終了を、予告なく行う場合があります。"
          ]
        },
        {
          "h": "お客様のファイル",
          "p": [
            "処理対象のファイルに関してお客様が有する権利は、引き続きお客様に帰属します。ファイルはお使いのデバイス上で処理され、当サイトのサーバーにアップロードされることはありません。選択したファイルを使用し、処理する権利をお持ちであることを確認する責任は、お客様にあります。"
          ]
        },
        {
          "h": "禁止事項",
          "p": [
            "次の行為を禁止します。法律に違反する目的で当サイトを使用すること、他者の権利を侵害すること、当サイトやそのホスティングサービスを妨害すること、またはその妨害を試みること、当サイトのツールやコンテンツを、出所を誤認させる形で複製または再販すること。"
          ]
        },
        {
          "h": "保証の否認",
          "p": [
            "これらのツールは「現状有姿」かつ「提供可能な状態」で提供され、いかなる種類の保証もありません。処理結果に誤りがないこと、出力結果の品質がお客様のニーズを満たすこと、サイトが常に利用できることを、当サイトは保証しません。元のファイルを保管し、処理結果を利用する前に、内容をご確認ください。"
          ]
        },
        {
          "h": "責任の制限",
          "p": [
            "法律で認められる範囲において、DGTool およびその所有者は、ファイルの紛失や破損、データの喪失を含め、お客様による当サイトの利用から生じるいかなる損失または損害についても責任を負いません。本規約のいかなる内容も、法律上制限できないお客様の権利を制限するものではありません。"
          ]
        },
        {
          "h": "広告と第三者のサービス",
          "p": [
            "当サイトは広告を表示することがあり、Cloudflare や Google Fonts などの第三者のサービスを利用しています。当サイトは、第三者が提供するコンテンツ、およびその運営や個人情報の取扱いについて責任を負いません。詳細は<a href=\"{privacy}\">プライバシーポリシー</a>をご覧ください。"
          ]
        },
        {
          "h": "規約の変更",
          "p": [
            "本規約は随時更新されることがあります。規約の変更後も当サイトを引き続きご利用になった場合は、更新後の規約に同意したものとみなされます。本規約の最終更新日は、ページ上部に記載しています。"
          ]
        },
        {
          "h": "お問い合わせ",
          "p": [
            "本規約に関するご質問は、<a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a> までお送りください。"
          ]
        }
      ]
    }
  },
  ko: {
    "about": {
      "title": "사이트 소개 | DGTool",
      "description": "DGTool은 브라우저에서 실행되는 무료 온라인 도구를 제공합니다. 파일은 사용자의 기기에 그대로 남습니다.",
      "h1": "DGTool 소개",
      "lead": "브라우저에서 실행되며 파일을 사용자의 기기에 그대로 두는 무료 온라인 도구입니다.",
      "sections": [
        {
          "h": "DGTool이란",
          "p": [
            "DGTool은 일상에서 마주치는 작은 작업을 위한 간단하고 무료인 도구를 만드는 개인 프로젝트입니다. 현재 제공하는 도구에는 iPhone의 HEIC 사진을 JPG나 PNG로 바꾸고 WebP 이미지를 JPG나 PNG로 바꾸는 이미지 형식 변환, 이미지 압축, 이미지 크기 조절, 워터마크 추가, 그리고 배경 제거가 있습니다. 앞으로도 도구를 계속 추가할 예정입니다."
          ]
        },
        {
          "h": "무엇이 다른가요",
          "p": [
            "많은 온라인 변환 사이트는 파일을 서버에 업로드하라고 요구합니다. DGTool은 사용자의 브라우저 안에서 작업을 처리합니다. 사진이 저희에게 전송되지 않고, 파일이 많을 때도 대개 더 빠르며, 이미지의 개인정보도 지킬 수 있습니다."
          ]
        },
        {
          "h": "작동 방식",
          "p": [
            "파일을 선택하면 페이지 안의 작은 프로그램이 사용자의 기기에서 파일을 읽어 변환합니다. 작업이 끝나면 브라우저에서 바로 결과를 다운로드할 수 있습니다. 가입이 필요 없고 파일 개수 제한도 없으며, 출력 이미지에 DGTool 워터마크가 자동으로 추가되지 않습니다."
          ]
        },
        {
          "h": "사이트 운영 방식",
          "p": [
            "DGTool은 무료로 사용할 수 있습니다. 호스팅과 개발 비용을 충당하기 위해 사이트에 광고가 표시될 수 있습니다. 광고와 쿠키가 어떻게 처리되는지는 <a href=\"{privacy}\">개인정보처리방침</a>에서 확인할 수 있습니다."
          ]
        },
        {
          "h": "현재 제공 도구",
          "p": [
            "<a href=\"{image}\">이미지 도구</a>를 둘러보거나 <a href=\"{home}\">홈</a>으로 돌아가 모든 도구를 확인하세요."
          ]
        },
        {
          "h": "오픈소스 구성 요소",
          "p": [
            "DGTool은 오픈소스 소프트웨어로 만들어졌습니다. HEIC 디코딩에는 <a href=\"https://github.com/alexcorvi/heic2any\" target=\"_blank\" rel=\"noopener\">heic2any</a>(MIT 라이선스, Copyright (c) 2020 Alex Corvi)를 사용하며, 여기에는 <a href=\"https://github.com/strukturag/libheif\" target=\"_blank\" rel=\"noopener\">libheif</a>와 관련 코덱 라이브러리가 포함되어 있습니다. libheif는 GNU Lesser General Public License(LGPL)로 제공되며, 소스 코드와 정확한 라이선스 조건은 libheif 프로젝트에서 확인할 수 있습니다.",
            "AI 배경 제거에는 Xuebin Qin 등의 <a href=\"https://github.com/xuebinqin/U-2-Net\" target=\"_blank\" rel=\"noopener\">U²-Net</a> 모델(Apache License 2.0)과 Microsoft의 <a href=\"https://github.com/microsoft/onnxruntime\" target=\"_blank\" rel=\"noopener\">ONNX Runtime Web</a>(MIT 라이선스)를 사용합니다."
          ]
        },
        {
          "h": "문의",
          "p": [
            "질문, 오류 제보, 도구 제안은 언제든지 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>로 보내 주세요."
          ]
        }
      ]
    },
    "privacy": {
      "title": "개인정보처리방침 | DGTool",
      "description": "DGTool이 파일, 쿠키, 광고, 개인정보를 어떻게 처리하는지 설명합니다.",
      "h1": "개인정보처리방침",
      "lead": "최종 업데이트: 2026년 11월 1일",
      "sections": [
        {
          "h": "파일은 사용자의 기기에 남습니다",
          "p": [
            "DGTool의 변환 도구는 사용자의 웹 브라우저 안에서 실행됩니다. 선택한 이미지는 사용자의 기기에서 처리되며 저희 서버에 업로드되지 않습니다. 저희는 변환되는 파일을 볼 수도, 저장하거나 공유할 수도 없습니다."
          ]
        },
        {
          "h": "수집하는 정보",
          "p": [
            "계정이 필요하지 않으며, 이름이나 이메일 주소 등 개인정보를 요청하지 않습니다. 대부분의 웹사이트와 마찬가지로 저희의 호스팅 및 보안 서비스 제공업체인 Cloudflare가 IP 주소, 브라우저 종류, 요청한 페이지, 각 요청의 날짜와 시간 같은 기술 정보를 자동으로 처리할 수 있습니다. 이 정보는 사이트 제공, 보안 유지, 악용 방지에 사용됩니다."
          ]
        },
        {
          "h": "쿠키",
          "p": [
            "이 사이트 자체는 사용자를 추적하기 위한 쿠키를 설정하지 않습니다. Cloudflare가 보안 목적으로 필수 쿠키를 설정할 수 있습니다. 앞으로 광고를 표시하거나 분석 도구를 추가하는 경우(아래 참조) 해당 서비스가 자체 쿠키를 설정할 수 있으며, 그때는 이 페이지를 업데이트하겠습니다."
          ]
        },
        {
          "h": "광고",
          "p": [
            "DGTool은 무료로 사용할 수 있으며 광고로 운영될 수 있습니다. Google과 같은 광고 파트너는 광고를 표시하고 성과를 측정하기 위해 쿠키나 유사한 기술을 사용할 수 있으며, 이 사이트와 다른 웹사이트 방문 정보를 이용해 관련 있는 광고를 표시할 수 있습니다. 유럽경제지역과 영국처럼 법률이 요구하는 지역에서는 맞춤 광고 쿠키를 사용하기 전에 동의를 받겠습니다.",
            "맞춤 광고는 Google 광고 설정에서 관리하거나 youradchoices.com 및 aboutads.info의 업계 도구를 통해 거부할 수 있습니다. 브라우저 설정에서 쿠키를 차단하거나 삭제할 수도 있습니다."
          ]
        },
        {
          "h": "제3자 서비스",
          "p": [
            "이 사이트는 Cloudflare를 통해 호스팅되고 전송됩니다. 웹 글꼴은 Google Fonts에서 불러오므로, 사용자의 브라우저가 글꼴 파일을 내려받기 위해 Google 서버에 연결할 수 있습니다. 이 업체들은 각자의 개인정보처리방침을 가지고 있습니다. 선택 사항인 AI 배경 제거 기능은 이 사이트에서 작은 AI 모델(U²-Net, Apache-2.0 라이선스)을 내려받습니다. 이후에는 기기에서 실행되며 이미지는 업로드되지 않습니다."
          ]
        },
        {
          "h": "사용자의 권리",
          "p": [
            "거주 지역에 따라 본인의 개인정보에 대해 열람, 정정, 삭제 또는 처리에 대한 이의 제기 등의 권리가 있을 수 있습니다. 저희는 계정 정보를 수집하지 않으므로 개별 방문자에 대해 보유한 정보가 매우 적습니다. 요청이나 문의는 아래 연락처로 보내 주세요."
          ]
        },
        {
          "h": "아동",
          "p": [
            "DGTool은 만 13세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 고의로 수집하지 않습니다."
          ]
        },
        {
          "h": "방침의 변경",
          "p": [
            "이 방침은 수시로 업데이트될 수 있습니다. 페이지 상단의 날짜는 마지막으로 변경된 날짜를 나타냅니다."
          ]
        },
        {
          "h": "연락처",
          "p": [
            "이 방침에 대한 문의는 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>로 보내 주세요."
          ]
        }
      ]
    },
    "terms": {
      "title": "이용약관 | DGTool",
      "description": "DGTool 무료 온라인 도구를 사용할 때 적용되는 약관입니다.",
      "h1": "이용약관",
      "lead": "최종 업데이트: 2026년 10월 17일",
      "sections": [
        {
          "h": "약관의 동의",
          "p": [
            "DGTool을 사용하면 이 약관에 동의한 것으로 간주됩니다. 동의하지 않는 경우 이 사이트를 사용하지 마세요."
          ]
        },
        {
          "h": "서비스 내용",
          "p": [
            "DGTool은 사용자의 웹 브라우저에서 파일을 처리하는 무료 도구를 제공합니다. 도구는 사전 통지 없이 추가, 변경 또는 삭제될 수 있습니다."
          ]
        },
        {
          "h": "사용자의 파일",
          "p": [
            "변환하는 파일에 대한 모든 권리는 사용자에게 있습니다. 파일은 사용자의 기기에서 처리되며 저희 서버에 업로드되지 않습니다. 선택한 파일을 사용하고 변환할 권리가 있는지 확인할 책임은 사용자에게 있습니다."
          ]
        },
        {
          "h": "허용되는 사용 방법",
          "p": [
            "사용자는 이 사이트를 불법적인 목적으로 사용하거나, 타인의 권리를 침해하거나, 사이트 또는 호스팅 서비스를 방해하거나 방해하려고 시도하지 않을 것에 동의합니다. 또한 출처를 오인하게 하는 방식으로 사이트의 도구나 콘텐츠를 복제하거나 재판매하지 않을 것에 동의합니다."
          ]
        },
        {
          "h": "보증의 부인",
          "p": [
            "이 도구는 \"있는 그대로\" 및 \"제공 가능한 범위에서\" 제공되며, 어떠한 종류의 보증도 하지 않습니다. 변환 결과에 오류가 없다는 것, 출력 품질이 사용자의 요구를 충족한다는 것, 사이트를 항상 이용할 수 있다는 것을 보장하지 않습니다. 원본 파일을 보관하고, 결과를 의존하기 전에 확인하세요."
          ]
        },
        {
          "h": "책임의 제한",
          "p": [
            "법률이 허용하는 범위에서 DGTool과 그 소유자는 파일의 분실 또는 손상, 데이터 손실을 포함하여 사용자가 이 사이트를 사용함으로써 발생하는 어떠한 손실이나 손해에 대해서도 책임을 지지 않습니다. 이 약관의 어떠한 내용도 법률상 제한할 수 없는 사용자의 권리를 제한하지 않습니다."
          ]
        },
        {
          "h": "광고 및 제3자 서비스",
          "p": [
            "이 사이트는 광고를 표시할 수 있으며 Cloudflare, Google Fonts와 같은 제3자 서비스를 사용합니다. 저희는 제3자의 콘텐츠나 관행에 대해 책임을 지지 않습니다. 자세한 내용은 <a href=\"{privacy}\">개인정보처리방침</a>을 참조하세요."
          ]
        },
        {
          "h": "약관의 변경",
          "p": [
            "이 약관은 수시로 업데이트될 수 있습니다. 약관이 변경된 후에도 사이트를 계속 사용하면 업데이트된 약관에 동의한 것으로 간주됩니다. 페이지 상단의 날짜는 마지막으로 변경된 날짜를 나타냅니다."
          ]
        },
        {
          "h": "연락처",
          "p": [
            "이 약관에 대한 문의는 <a href=\"mailto:contact@dgtool.io\">contact@dgtool.io</a>로 보내 주세요."
          ]
        }
      ]
    }
  }
};
