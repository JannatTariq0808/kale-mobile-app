// On-device pose landmarks + person mask for body-shape capture.
// MediaPipe Pose Landmarker (with segmentation mask) on a still image file.
// The image is read from local storage and never leaves the phone.
package expo.modules.bodyshapevision

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.ByteBufferExtractor
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.nio.ByteOrder
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

private const val MODEL_FILE = "pose_landmarker_full.task"
private const val MODEL_LABEL = "mediapipe-pose-landmarker-full-0.10.21"

/** MediaPipe BlazePose indices for the landmarks the bodyshape library uses. */
private val LANDMARK_INDEX = mapOf(
  "nose" to 0,
  "left_shoulder" to 11, "right_shoulder" to 12,
  "left_hip" to 23, "right_hip" to 24,
  "left_knee" to 25, "right_knee" to 26,
  "left_ankle" to 27, "right_ankle" to 28,
  "left_heel" to 29, "right_heel" to 30,
)

class BodyShapeVisionModule : Module() {
  private var landmarker: PoseLandmarker? = null

  override fun definition() = ModuleDefinition {
    Name("BodyShapeVision")

    AsyncFunction("detect") { imageUri: String, maskMaxSide: Int ->
      val path = Uri.parse(imageUri).path ?: imageUri
      val bitmap = BitmapFactory.decodeFile(path)
        ?: throw CodedException("ImageUnreadable", "Could not read frame image", null)
      val result = poseLandmarker().detect(BitmapImageBuilder(bitmap).build())

      val pose = result.landmarks().firstOrNull()
      val mask = result.segmentationMasks().orElse(null)?.firstOrNull()
      if (pose == null || mask == null) return@AsyncFunction null

      val landmarks = LANDMARK_INDEX.mapNotNull { (name, index) ->
        pose.getOrNull(index)?.let { lm ->
          name to mapOf(
            "x" to lm.x().toDouble(),
            "y" to lm.y().toDouble(),
            "visibility" to (lm.visibility().orElse(0f)).toDouble(),
          )
        }
      }.toMap()

      mapOf(
        "width" to bitmap.width,
        "height" to bitmap.height,
        "landmarks" to landmarks,
        "mask" to downscaledMask(mask, max(64, maskMaxSide)),
        "poseCount" to result.landmarks().size,
        "poseModel" to MODEL_LABEL,
        "segmentationModel" to "$MODEL_LABEL-mask",
      )
    }
  }

  private fun poseLandmarker(): PoseLandmarker {
    landmarker?.let { return it }
    val context = appContext.reactContext
      ?: throw CodedException("NoContext", "React context unavailable", null)
    val options = PoseLandmarker.PoseLandmarkerOptions.builder()
      .setBaseOptions(BaseOptions.builder().setModelAssetPath(MODEL_FILE).build())
      .setRunningMode(RunningMode.IMAGE)
      .setNumPoses(2)
      .setMinPoseDetectionConfidence(0.5f)
      .setMinPosePresenceConfidence(0.5f)
      .setOutputSegmentationMasks(true)
      .build()
    return PoseLandmarker.createFromOptions(context, options).also { landmarker = it }
  }

  /** Person mask as 0-255 bytes (base64), longest side at most maxSide, same aspect ratio. */
  private fun downscaledMask(mask: MPImage, maxSide: Int): Map<String, Any> {
    val w = mask.width
    val h = mask.height
    val floats = ByteBufferExtractor.extract(mask).order(ByteOrder.nativeOrder()).asFloatBuffer()
    val scale = min(1.0, maxSide.toDouble() / max(w, h))
    val ow = max(1, (w * scale).roundToInt())
    val oh = max(1, (h * scale).roundToInt())
    val bytes = ByteArray(ow * oh)
    for (y in 0 until oh) {
      val sy = min(h - 1, (y / scale).toInt())
      for (x in 0 until ow) {
        val sx = min(w - 1, (x / scale).toInt())
        val v = floats.get(sy * w + sx).coerceIn(0f, 1f)
        bytes[y * ow + x] = (v * 255f).roundToInt().toByte()
      }
    }
    return mapOf("width" to ow, "height" to oh, "base64" to Base64.encodeToString(bytes, Base64.NO_WRAP))
  }
}
