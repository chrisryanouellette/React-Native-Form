import React, { ReactNode } from "react";
import { ScrollViewProps, StyleSheet } from "react-native";
import Modal, { ModalProps } from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { useStore } from "@src/helpers/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSelectContext } from "./context";

export type SelectModalProps = Partial<ModalProps> & {
  children: ReactNode;
  scrollViewProps?: ScrollViewProps;
  stickyHeader?: boolean;
};

export function SelectModal({
  style,
  scrollViewProps,
  stickyHeader,
  children,
  ...rest
}: SelectModalProps): JSX.Element {
  const context = useSelectContext();
  const insets = useSafeAreaInsets();
  const isOpen = useStore(context.store, state => state.isOpen);

  function handleClose(): void {
    context.store.set({ isOpen: false });
  }

  return (
    <Modal
      swipeDirection="down"
      useNativeDriverForBackdrop
      {...rest}
      hideModalContentWhileAnimating
      backdropOpacity={0.25}
      propagateSwipe
      style={[
        style,
        styles.modal,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      isVisible={isOpen}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
    >
      <ScrollView
        {...scrollViewProps}
        stickyHeaderIndices={stickyHeader ? [0] : undefined}
        style={[styles.container, scrollViewProps?.style]}
      >
        {children}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    margin: 0,
  },
  container: {
    marginTop: "auto",
    height: "100%",
  },
});
