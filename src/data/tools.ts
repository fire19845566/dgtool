// One entry = one indexable page. Add a tool by adding an object here.
interface ToolBase {
  slug: string;
  category: 'image';
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  accept: string;          // <input accept>
  icon?: { from: string; to: string; f: string };   // overrides the auto icon
  howTo: string[];                         // numbered steps
  sections: { h: string; p: string[] }[];  // explanatory content
  faq: { q: string; a: string }[];
  related: string[];
}

export interface ConvertTool extends ToolBase {
  kind: 'convert';
  fromExt: RegExp;         // used to rename the output file
  to: 'image/jpeg' | 'image/png';
  toExt: 'jpg' | 'png';
  engine: 'heic' | 'canvas';
}

export interface CompressTool extends ToolBase {
  kind: 'compress';
}

export type Tool = ConvertTool | CompressTool;

export const tools: Tool[] = [
  {
    slug: 'heic-to-jpg',
    category: 'image',
    kind: 'convert',
    name: 'HEIC to JPG',
    h1: 'HEIC to JPG, without uploading anything',
    title: 'HEIC to JPG Converter – Free, Private, No Upload',
    description: 'Convert iPhone HEIC photos to JPG in your browser. Files never leave your device. No sign-up, no limits.',
    intro: 'Convert iPhone photos right in your browser. Your files stay on your device, and there is no sign-up or file limit.',
    accept: '.heic,.heif,image/heic,image/heif',
    fromExt: /\.(heic|heif)$/i,
    to: 'image/jpeg', toExt: 'jpg', engine: 'heic',
    howTo: [
      'Click the upload area and choose one or more HEIC files, or drag them onto the page.',
      'Leave the quality at 90% for a good balance of sharpness and file size, or move the slider.',
      'Wait a moment while each photo is converted on your device.',
      'Click Download next to a photo, or use Download all to save every result.',
    ],
    sections: [
      {
        h: 'What is a HEIC file?',
        p: [
          'HEIC is the photo format that iPhones and iPads have used by default since iOS 11. It belongs to the HEIF family and uses modern compression, so a photo can stay sharp while taking up less storage than a JPG.',
          'The trade-off is compatibility. Many websites, older apps, printers and some Windows setups cannot open HEIC files, which is why people often need to convert them.',
        ],
      },
      {
        h: 'Why convert HEIC to JPG?',
        p: [
          'JPG opens almost everywhere: web upload forms, email, document editors, printing services and social apps. Converting a HEIC photo to JPG is the simplest way to make sure the person receiving it can view it without installing anything.',
        ],
      },
      {
        h: 'Choosing the quality setting',
        p: [
          'JPG is a lossy format, so each conversion trades a little detail for a smaller file. At 90% the difference is rarely visible on a screen, and the files stay a reasonable size. Lower the slider if you need smaller files, for example to email many photos. Going to 100% makes the files larger without a visible improvement in most cases.',
        ],
      },
      {
        h: 'Good to know',
        p: [
          'If a HEIC file contains more than one image, only the first one is converted. Some information stored inside the original, such as location data, may not be carried into the converted JPG.',
          'Everything is processed by your own device, so converting a lot of large photos at once can be slow on a phone or an older computer. If a batch struggles, try a few photos at a time.',
        ],
      },
      {
        h: 'Stop your iPhone from saving HEIC',
        p: [
          'If you would rather have JPG from the start, open Settings, go to Camera, then Formats, and choose Most Compatible. New photos will be saved as JPG, though they take more storage. Menu names can differ slightly between iOS versions.',
        ],
      },
    ],
    faq: [
      { q: 'Why is my iPhone photo a HEIC file?', a: 'iPhones save photos as HEIC by default to use less storage. Many websites, apps and printers cannot open HEIC, so converting to JPG makes the photo work everywhere.' },
      { q: 'Are my photos uploaded to a server?', a: 'No. The conversion runs inside your browser tab, so your photos never leave your device.' },
      { q: 'Does converting reduce quality?', a: 'JPG is a lossy format, so a small amount of detail is lost. Keep the quality slider at 90% or higher for photos that look the same to the eye.' },
      { q: 'How do I open a HEIC file on Windows?', a: 'Depending on your version of Windows, you may need extra image extensions from the Microsoft Store to open HEIC files. Converting the photo to JPG avoids that, because JPG opens in any program.' },
      { q: 'Is there a limit on how many photos I can convert?', a: 'We do not set a limit and there is no sign-up. Very large batches depend on your device\'s memory, so convert a few photos at a time if things slow down.' },
      { q: 'Will the converted photo keep its location data?', a: 'Not necessarily. Some information stored in the original file, such as the location where the photo was taken, may not be carried over to the JPG. If you rely on that information, check the result before deleting the original.' },
    ],
    related: ['heic-to-png', 'webp-to-jpg', 'compress-image'],
  },
  {
    slug: 'heic-to-png',
    category: 'image',
    kind: 'convert',
    name: 'HEIC to PNG',
    h1: 'HEIC to PNG, right in your browser',
    title: 'HEIC to PNG Converter – Free, Private, No Upload',
    description: 'Convert HEIC images to lossless PNG in your browser. No upload, no sign-up.',
    intro: 'Turn HEIC photos into lossless PNG files without sending them to a server.',
    accept: '.heic,.heif,image/heic,image/heif',
    fromExt: /\.(heic|heif)$/i,
    to: 'image/png', toExt: 'png', engine: 'heic',
    howTo: [
      'Click the upload area and choose one or more HEIC files, or drag them onto the page.',
      'Wait a moment while each image is converted on your device.',
      'Click Download next to an image, or use Download all to save every result.',
    ],
    sections: [
      {
        h: 'HEIC vs PNG',
        p: [
          'HEIC is a compact photo format used by iPhones. PNG is a widely supported format that stores every pixel without further compression loss and supports transparency. Converting HEIC to PNG makes the image open in nearly any app, including editors that do not understand HEIC.',
        ],
      },
      {
        h: 'When should you choose PNG?',
        p: [
          'PNG is a good fit when you plan to edit the image further and want to avoid adding another round of lossy compression, when the image is a graphic or screenshot with sharp edges, or when an app or website specifically asks for PNG.',
          'If you only want to share or upload a normal photo, JPG is usually the better choice because the files are much smaller.',
        ],
      },
      {
        h: 'What to expect',
        p: [
          'PNG files are usually much larger than the original HEIC. That is normal: PNG keeps every pixel, while HEIC uses efficient compression. Converting to PNG also does not bring back detail that was already lost when the photo was first saved as HEIC.',
          'If a HEIC file contains more than one image, only the first one is converted.',
        ],
      },
    ],
    faq: [
      { q: 'When should I choose PNG instead of JPG?', a: 'PNG keeps every pixel and supports transparency, but the files are much larger. Choose it for screenshots, graphics or editing; choose JPG for sharing photos.' },
      { q: 'Why is the PNG so much bigger than the HEIC?', a: 'HEIC is designed to be small, while PNG stores the image without further compression loss. A large size increase is expected, especially for photos.' },
      { q: 'Will converting to PNG improve the quality?', a: 'No. PNG preserves what is in the image at the moment of conversion, but it cannot restore detail that the original HEIC file did not contain.' },
      { q: 'Are my files uploaded?', a: 'No. Everything is converted locally in your browser.' },
    ],
    related: ['heic-to-jpg', 'webp-to-png', 'compress-image'],
  },
  {
    slug: 'webp-to-jpg',
    category: 'image',
    kind: 'convert',
    name: 'WebP to JPG',
    h1: 'WebP to JPG, instantly',
    title: 'WebP to JPG Converter – Free, Private, No Upload',
    description: 'Convert WebP images to JPG in your browser. No upload, no sign-up, no limits.',
    intro: 'Save WebP images as JPG so they open in any app. Conversion happens on your device.',
    accept: '.webp,image/webp',
    fromExt: /\.webp$/i,
    to: 'image/jpeg', toExt: 'jpg', engine: 'canvas',
    howTo: [
      'Click the upload area and choose one or more WebP files, or drag them onto the page.',
      'Leave the quality at 90% for a good balance of sharpness and file size, or move the slider.',
      'Wait a moment while each image is converted on your device.',
      'Click Download next to an image, or use Download all to save every result.',
    ],
    sections: [
      {
        h: 'What is a WebP image?',
        p: [
          'WebP is an image format created by Google for the web. It can be smaller than JPG or PNG at similar visual quality, and it supports transparency, so many websites serve their pictures as WebP.',
          'The catch is that when you save such an image from a website, you may end up with a .webp file that some older editors, upload forms and printers do not accept.',
        ],
      },
      {
        h: 'Why convert WebP to JPG?',
        p: [
          'JPG is accepted almost everywhere. Converting a WebP image to JPG is a quick way to use it in a document, send it to someone, or upload it to a site that does not support WebP.',
        ],
      },
      {
        h: 'What happens to transparent areas?',
        p: [
          'JPG cannot store transparency. If your WebP image has transparent areas, they are filled with white in the JPG. If you need to keep the transparency, use the WebP to PNG converter instead.',
        ],
      },
      {
        h: 'Animated WebP files',
        p: [
          'An animated WebP is converted to a single still image, using its first frame. JPG cannot store animation.',
        ],
      },
      {
        h: 'Choosing the quality setting',
        p: [
          'JPG is a lossy format, so a lower quality makes a smaller file with a little less detail. 90% is a good default. Lower it if you need a smaller file, and leave it high for images you want to keep sharp.',
        ],
      },
    ],
    faq: [
      { q: 'Why did my image download as WebP?', a: 'Many websites serve images as WebP because the files are smaller. When you save the image, your browser keeps the WebP format.' },
      { q: 'What happens to transparent areas?', a: 'JPG does not support transparency, so transparent areas are filled with white. Use WebP to PNG if you want to keep transparency.' },
      { q: 'What happens to an animated WebP?', a: 'It is converted to a still image using the first frame, because JPG cannot store animation.' },
      { q: 'Are my files uploaded?', a: 'No. Everything is converted locally in your browser.' },
    ],
    related: ['webp-to-png', 'heic-to-jpg', 'compress-image'],
  },
  {
    slug: 'webp-to-png',
    category: 'image',
    kind: 'convert',
    name: 'WebP to PNG',
    h1: 'WebP to PNG, keeping transparency',
    title: 'WebP to PNG Converter – Free, Private, No Upload',
    description: 'Convert WebP images to PNG in your browser and keep transparency. No upload required.',
    intro: 'Convert WebP to PNG and keep transparent backgrounds. Nothing is uploaded.',
    accept: '.webp,image/webp',
    fromExt: /\.webp$/i,
    to: 'image/png', toExt: 'png', engine: 'canvas',
    howTo: [
      'Click the upload area and choose one or more WebP files, or drag them onto the page.',
      'Wait a moment while each image is converted on your device.',
      'Click Download next to an image, or use Download all to save every result.',
    ],
    sections: [
      {
        h: 'What is a WebP image?',
        p: [
          'WebP is an image format created by Google for the web. It produces small files and supports transparency, so many websites use it for logos, icons and photos. Some older editors and upload forms still cannot open it.',
        ],
      },
      {
        h: 'Why convert WebP to PNG?',
        p: [
          'PNG is supported almost everywhere and keeps transparent backgrounds, which makes it a good choice for logos, icons and graphics that you want to place on top of other images or backgrounds.',
        ],
      },
      {
        h: 'Transparency is kept',
        p: [
          'Transparent areas in your WebP image stay transparent in the PNG. If you convert to JPG instead, transparent areas become white, because JPG cannot store transparency.',
        ],
      },
      {
        h: 'What to expect',
        p: [
          'PNG files are often larger than WebP files, especially for photos. An animated WebP is converted to a single still image using its first frame, because PNG as produced here does not store animation.',
        ],
      },
    ],
    faq: [
      { q: 'Is transparency preserved?', a: 'Yes. PNG supports transparency, so transparent WebP areas stay transparent.' },
      { q: 'Why is the PNG larger than the WebP?', a: 'WebP is built to produce small files. PNG stores the image without further compression loss, so the file is often noticeably larger, especially for photos.' },
      { q: 'What happens to an animated WebP?', a: 'It is converted to a still image using the first frame.' },
      { q: 'Are my files uploaded?', a: 'No. Everything is converted locally in your browser.' },
    ],
    related: ['webp-to-jpg', 'heic-to-png', 'compress-image'],
  },
  {
    slug: 'compress-image',
    category: 'image',
    kind: 'compress',
    name: 'Compress Image',
    h1: 'Compress images without uploading them',
    title: 'Compress Images Online – Free, Private, No Upload',
    description: 'Reduce JPG, PNG and WebP file sizes in your browser. Your images never leave your device. No sign-up, no limits.',
    intro: 'Make photos and graphics smaller right in your browser. Nothing is uploaded, and there is no sign-up or file limit.',
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
    icon: { from: '5 MB', to: '1 MB', f: 'size' },
    howTo: [
      'Click the upload area and choose JPG, PNG or WebP images, or drag them onto the page.',
      'Move the quality slider. Around 75% to 85% usually keeps photos looking the same while making the files much smaller.',
      'Optionally limit the longest side of the image. Shrinking a very large photo often saves more space than lowering the quality alone.',
      'Check the before and after sizes, then download each image or use Download all.',
    ],
    sections: [
      {
        h: "How image compression works",
        p: [
          "JPG and WebP are lossy formats. When an image is saved again at a lower quality, the file keeps most of what you can see and drops fine detail that is hard to notice, which makes the file smaller. Reducing the number of pixels shrinks the file even more.",
        ],
      },
      {
        h: "Choosing quality and size",
        p: [
          "These are rules of thumb, not fixed rules. For web pages, email and messaging, a quality of about 70% to 80% and a longest side of 1920 pixels is a common choice. For photos you want to keep, stay at 85% or higher, or keep the original. For small previews, 1024 pixels on the longest side is usually enough.",
          "Compression cannot bring back detail, so always keep your original files.",
        ],
      },
      {
        h: "How PNG files are compressed",
        p: [
          "PNG itself does not have a quality setting, so PNG images are made smaller by reducing the number of colors, up to 256, and saving the result as an indexed PNG. For logos, icons and screenshots this often makes the file much smaller with no visible change, and when an image already uses few colors the result looks identical to the original.",
          "For photos saved as PNG, a low quality setting can cause visible banding in smooth areas, so keep the quality high, or choose WebP or JPG as the format for much smaller files. JPG cannot store transparency, so transparent areas are filled with white. WebP keeps transparency.",
        ],
      },
      {
        h: "What is removed",
        p: [
          "Information stored inside the original file, such as camera details and the location where a photo was taken, is not copied into the compressed image. That also makes the result safer to share.",
          "If compressing would make a file larger than the original, the original is kept and marked as already well compressed.",
        ],
      },
      {
        h: "Very large images on iPhone and iPad",
        p: [
          "Safari on iPhone and iPad can only handle images up to roughly 16 megapixels at a time. Larger images, such as some 48 megapixel photos, are reduced slightly in size on those devices so they can be processed.",
        ],
      },
    ],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. The compression runs inside your browser tab, so your images never leave your device." },
      { q: "How much smaller will my files get?", a: "It depends on the image. Large photos often shrink a lot when you lower the quality or the size, while images that are already compressed, such as screenshots and small graphics, change less." },
      { q: "Will the quality look worse?", a: "At about 75% to 85% the difference is usually hard to notice at normal viewing size, but zooming in can reveal it. Keep your originals and compare the result before replacing anything." },
      { q: "Why was my file kept the same size?", a: "Some files are already well compressed, and saving them again would make them larger. In that case we keep the original instead of giving you a bigger file." },
      { q: "Which format is best for the web?", a: "WebP is often smaller than JPG at a similar quality and works in modern browsers. JPG is the safest choice if you need the image to open everywhere." },
      { q: "How is a PNG compressed here?", a: "The image is reduced to a smaller set of colors, up to 256, and saved as an indexed PNG. The quality slider controls how many colors are kept. Images that already use few colors, such as many logos and icons, can shrink with no change at all." },
      { q: "Why did my PNG barely shrink or get kept as is?", a: "Some PNG files are already well optimized, and tiny icons have little left to remove. For a photo saved as PNG, try WebP or JPG as the format, or reduce the longest side." },
      { q: "Can I compress iPhone HEIC photos?", a: "Not directly on this page. Convert them first with the HEIC to JPG tool, then compress the JPG." },
    ],
    related: ['heic-to-jpg', 'webp-to-jpg', 'webp-to-png'],
  },
];

export const categories = {
  image: { label: 'Image', blurb: 'Convert and compress images privately, right in your browser.' },
} as const;

export const toolPath = (t: Tool) => `/${t.category}/${t.slug}`;

export const bySlug = (slug: string) => tools.find((t) => t.slug === slug)!;

// Icon shown on cards: auto-generated from "a-to-b" slugs unless the tool defines its own.
export const iconOf = (t: Tool) => {
  if (t.icon) return t.icon;
  const [a, b] = t.slug.split('-to-');
  return { from: a.toUpperCase(), to: b.toUpperCase(), f: b };
};
