import { swSource } from '../pwa/sw-source';
import { LANGS, DEFAULT_LANG, localePath } from '../i18n';

// Built once per deploy, so the version below changes with every release.
export const GET = () =>
  new Response(
    swSource(
      String(Date.now()),
      LANGS.filter((l) => l !== DEFAULT_LANG).map((l) => localePath(l, '')),
    ),
    { headers: { 'Content-Type': 'application/javascript; charset=utf-8' } },
  );
