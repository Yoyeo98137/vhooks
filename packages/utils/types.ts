import type { Ref } from "vue";

export type UnRef<T> = T extends Ref<infer V> ? V : T;

export type UnWrapRefObject<T> = {
  [P in keyof T]: UnRef<T[P]>;
};

export type Timeout = ReturnType<typeof setTimeout>;

export type Nullable<T> = T | null;