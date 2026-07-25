import { PATH_FORWARD_ICON } from './path-forward.icon';
import { REWIND_ICON } from './rewind.icon';
import { SPARK_ICON } from './spark.icon';
import { HELP_ICON } from './help.icon';

export const ICON_REGISTRY = {
  rewind: REWIND_ICON,
  'path-forward': PATH_FORWARD_ICON,
  spark: SPARK_ICON,
  help: HELP_ICON,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
