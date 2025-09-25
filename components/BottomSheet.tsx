
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const SNAP_POINTS = [0, 0.6, 0.9]; // Closed, Medium, Full
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.backgroundAlt,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: SCREEN_HEIGHT * 0.3,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default function SimpleBottomSheet({ children, isVisible, onClose }: SimpleBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [gestureEnabled, setGestureEnabled] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setGestureEnabled(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT * (1 - SNAP_POINTS[1]),
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, translateY, backdropOpacity]);

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const snapToPoint = (point: number) => {
    const toValue = SCREEN_HEIGHT * (1 - point);
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const getClosestSnapPoint = (currentY: number, velocityY: number): number => {
    const currentProgress = 1 - currentY / SCREEN_HEIGHT;
    
    if (velocityY > 500) {
      return SNAP_POINTS[0]; // Close
    }
    
    if (velocityY < -500) {
      return SNAP_POINTS[2]; // Full
    }
    
    let closest = SNAP_POINTS[0];
    let minDistance = Math.abs(currentProgress - closest);
    
    for (const point of SNAP_POINTS) {
      const distance = Math.abs(currentProgress - point);
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    }
    
    return closest;
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      const currentY = SCREEN_HEIGHT * (1 - SNAP_POINTS[1]) + translationY;
      
      const targetSnapPoint = getClosestSnapPoint(currentY, velocityY);
      
      if (targetSnapPoint === SNAP_POINTS[0] && onClose) {
        onClose();
      } else {
        snapToPoint(targetSnapPoint);
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
          <TouchableWithoutFeedback>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
              enabled={gestureEnabled}
            >
              <Animated.View
                style={[
                  styles.container,
                  {
                    transform: [{ translateY }],
                  },
                ]}
              >
                <View style={styles.handle} />
                <ScrollView
                  style={styles.content}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {children}
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
