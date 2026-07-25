import { PATH_FORWARD_ICON } from './path-forward.icon';
import { REWIND_ICON } from './rewind.icon';
import { SPARK_ICON } from './spark.icon';
import { HELP_ICON } from './help.icon';
import { COIN_ICON } from './coin.icon';
import { BOLT_ICON } from './bolt.icon';

export const ICON_REGISTRY = {
  rewind: REWIND_ICON,
  'path-forward': PATH_FORWARD_ICON,
  spark: SPARK_ICON,
  help: HELP_ICON,
  coin: COIN_ICON,
  bolt: BOLT_ICON,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
