import type { Lang } from '../index';
import type { ToolCopy } from '../../data/tools';
import { en } from './en';
import { zhTw } from './zh-tw';
import { ja } from './ja';
import { ko } from './ko';

// Languages without an entry here fall back to English.
export const content: Record<Lang, Record<string, ToolCopy>> = { en, 'zh-tw': zhTw, ja, ko };
