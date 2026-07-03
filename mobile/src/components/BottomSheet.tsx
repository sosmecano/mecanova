import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BorderRadius, Spacing } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_VISIBLE = 440;
const HEADER_OFFSET = 60;
const SNAP_COLLAPSED = SCREEN_HEIGHT - COLLAPSED_VISIBLE;
const SNAP_EXPANDED = HEADER_OFFSET;

interface Props {
  children: React.ReactNode;
  style?: any;
  onSnap?: (index: number) => void;
}

export default function BottomSheet({ children, style, onSnap }: Props) {
  const topVal = useSharedValue(SNAP_COLLAPSED);
  const contextY = useSharedValue(SNAP_COLLAPSED);
  const snapMid = (SNAP_EXPANDED + SNAP_COLLAPSED) / 2;

  const gesture = Gesture.Pan()
    .onStart(() => { contextY.value = topVal.value; })
    .onUpdate((e) => {
      topVal.value = Math.max(
        SNAP_EXPANDED - 20,
        Math.min(SNAP_COLLAPSED + 20, contextY.value + e.translationY)
      );
    })
    .onEnd(() => {
      const goingDown = topVal.value > snapMid;
      const snap = goingDown ? SNAP_COLLAPSED : SNAP_EXPANDED;
      topVal.value = withSpring(snap, { damping: 20, stiffness: 150 });
      contextY.value = snap;
      if (onSnap) runOnJS(onSnap)(goingDown ? 1 : 0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: topVal.value,
  }));

  return (
    <Animated.View style={[styles.container, { height: SCREEN_HEIGHT }, animatedStyle, style]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.handleHitArea}>
          <View style={styles.handle} />
        </View>
      </GestureDetector>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderTopLeftRadius: BorderRadius.xl + 4,
    borderTopRightRadius: BorderRadius.xl + 4,
    padding: Spacing.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  handleHitArea: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  content: {
    flex: 1,
  },
});
