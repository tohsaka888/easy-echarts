import { createContextState } from "foxact/context-state";

const [ModalLoadingProvider, useModalLoading, useSetModalLoading] =
  createContextState<boolean>(false);

export { ModalLoadingProvider, useModalLoading, useSetModalLoading };
