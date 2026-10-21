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
          "DGTool is an independent project that builds simple, free tools for everyday tasks. Tools so far include image format conversion, such as turning iPhone HEIC photos into JPG or PNG and WebP images into JPG or PNG, and image compression. More tools are added over time."
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
          "When you pick a file, a small program on the page reads it and converts it on your device. When it finishes, you download the result straight from your browser. There is no sign-up, no file limit and no watermark."
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
    "lead": "Last updated: October 17, 2026",
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
          "This site is hosted and delivered through Cloudflare. Web fonts are loaded from Google Fonts, which means your browser may contact Google's servers to download the font files. These providers have their own privacy policies."
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
          "DGTool 是一個獨立專案，製作簡單、免費的工具，處理日常會遇到的小工作。目前的工具包括圖片格式轉換，例如把 iPhone 的 HEIC 照片轉成 JPG 或 PNG、把 WebP 圖片轉成 JPG 或 PNG，以及圖片壓縮。未來會陸續增加更多工具。"
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
          "選擇檔案之後，頁面上的一小段程式會在你的裝置上讀取並轉換它。完成後，你可以直接從瀏覽器下載結果。不需要註冊，沒有檔案數量限制，也沒有浮水印。"
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
    "lead": "最後更新：2026 年 10 月 17 日",
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
          "本站透過 Cloudflare 託管與傳送。網頁字型從 Google Fonts 載入，這表示你的瀏覽器可能會連線到 Google 的伺服器下載字型檔。這些供應商各有自己的隱私權政策。"
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
      "lead": "ブラウザ上で動作し、ファイルをお使いのデバイスに残したままにする無料のオンラインツールです。",
      "sections": [
        {
          "h": "DGTool とは",
          "p": [
            "DGTool は、日常のちょっとした作業のための、シンプルで無料のツールを作っている個人プロジェクトです。現在のツールには、iPhone の HEIC 写真を JPG や PNG に変換する、WebP 画像を JPG や PNG に変換するといった画像形式の変換と、画像の圧縮があります。今後もツールを追加していきます。"
          ]
        },
        {
          "h": "ほかとの違い",
          "p": [
            "多くのオンライン変換サイトは、ファイルをサーバーにアップロードするよう求めます。DGTool は、お使いのブラウザの中で処理を行います。写真が私たちに送信されることはなく、多くのファイルを扱うときも速いことが多く、画像のプライバシーも守られます。"
          ]
        },
        {
          "h": "しくみ",
          "p": [
            "ファイルを選ぶと、ページ上の小さなプログラムがお使いのデバイス上でそれを読み込み、変換します。完了したら、ブラウザから結果をそのままダウンロードできます。登録は不要で、ファイル数の制限も透かしもありません。"
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
      "lead": "最終更新日：2026 年 10 月 17 日",
      "sections": [
        {
          "h": "ファイルはお使いのデバイスに残ります",
          "p": [
            "DGTool の変換ツールは、お使いのウェブブラウザの中で動作します。選択した画像はお使いのデバイス上で処理され、当サイトのサーバーにアップロードされることはありません。当サイトは、変換されるファイルを見ることも、保存することも、共有することもできません。"
          ]
        },
        {
          "h": "収集する情報",
          "p": [
            "ご利用にあたってアカウントは必要なく、お名前、メールアドレス、その他の個人情報をお尋ねすることもありません。多くのウェブサイトと同様に、当サイトのホスティングおよびセキュリティの提供元である Cloudflare が、IP アドレス、ブラウザの種類、リクエストされたページ、各リクエストの日時などの技術的な情報を自動的に処理することがあります。これらは、サイトの提供、セキュリティの維持、不正利用の防止に使われます。"
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
            "DGTool は無料でご利用いただけ、広告によって運営される場合があります。Google などの広告パートナーは、広告の表示や効果の測定のために Cookie や類似の技術を使用することがあり、当サイトやほかのウェブサイトへのご訪問に関する情報を、関連性の高い広告の表示に利用することがあります。欧州経済領域や英国など、法律で求められている地域では、パーソナライズ広告の Cookie を使用する前に、同意をお願いします。",
            "パーソナライズ広告は、Google の広告設定で管理できるほか、youradchoices.com や aboutads.info の業界ツールでオプトアウトすることもできます。ブラウザの設定で Cookie をブロックまたは削除することも可能です。"
          ]
        },
        {
          "h": "第三者のサービス",
          "p": [
            "当サイトは Cloudflare を通じてホスティングおよび配信されています。ウェブフォントは Google Fonts から読み込まれるため、お使いのブラウザがフォントファイルをダウンロードするために Google のサーバーに接続することがあります。これらの提供元には、それぞれ独自のプライバシーポリシーがあります。"
          ]
        },
        {
          "h": "お客様の権利",
          "p": [
            "お住まいの地域によっては、ご自身の個人データについて、アクセス、訂正、削除、処理への異議申し立てなどの権利がある場合があります。当サイトはアカウント情報を収集しないため、個々の訪問者について保有しているデータはごくわずかです。請求やご質問は、以下の連絡先までお寄せください。"
          ]
        },
        {
          "h": "お子様",
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
            "DGTool は、お使いのウェブブラウザ上でファイルを処理する無料のツールを提供します。ツールは、予告なく追加、変更、削除されることがあります。"
          ]
        },
        {
          "h": "お客様のファイル",
          "p": [
            "変換したファイルに関するすべての権利は、お客様に帰属します。ファイルはお使いのデバイス上で処理され、当サイトのサーバーにアップロードされることはありません。選択したファイルを使用し、変換する権利をお持ちであることを確認する責任は、お客様にあります。"
          ]
        },
        {
          "h": "許可される利用方法",
          "p": [
            "お客様は、当サイトを法律に違反する目的で使用すること、他者の権利を侵害すること、当サイトやそのホスティングサービスを妨害したり、妨害しようとしたりすることをしないものとします。また、当サイトのツールやコンテンツを、出所を誤認させる形で複製または再販しないものとします。"
          ]
        },
        {
          "h": "保証の否認",
          "p": [
            "これらのツールは「現状有姿」かつ「提供可能な範囲」で提供され、いかなる種類の保証もありません。変換結果に誤りがないこと、出力の品質がお客様のニーズを満たすこと、サイトが常に利用できることを、当サイトは保証しません。元のファイルを保管し、結果を信頼する前に確認してください。"
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
            "当サイトは広告を表示することがあり、Cloudflare や Google Fonts などの第三者のサービスを利用しています。当サイトは、第三者のコンテンツや取り扱いについて責任を負いません。詳細は<a href=\"{privacy}\">プライバシーポリシー</a>をご覧ください。"
          ]
        },
        {
          "h": "規約の変更",
          "p": [
            "本規約は随時更新されることがあります。規約の変更後も当サイトを引き続きご利用になることは、更新後の規約に同意したものとみなされます。ページ上部の日付は、最後に変更された日を示しています。"
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
  }
};
