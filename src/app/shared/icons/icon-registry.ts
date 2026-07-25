import { PATH_FORWARD_ICON } from './path-forward.icon';
import { REWIND_ICON } from './rewind.icon';

export const ICON_REGISTRY = {
  rewind: REWIND_ICON,
  'path-forward': PATH_FORWARD_ICON,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;