// On-device pose landmarks + person mask for body-shape capture.
// MediaPipe Pose Landmarker (with segmentation mask) on a still image file.
// The image is read from local storage and never leaves the phone.

import ExpoModulesCore
import MediaPipeTasksVision
import UIKit

private let modelName = "pose_landmarker_full"
private let modelLabel = "mediapipe-pose-landmarker-full-0.10.21"

/// MediaPipe BlazePose indices for the landmarks the bodyshape library uses.
private let landmarkIndex: [String: Int] = [
  "nose": 0,
  "left_shoulder": 11, "right_shoulder": 12,
  "left_hip": 23, "right_hip": 24,
  "left_knee": 25, "right_knee": 26,
  "left_ankle": 27, "right_ankle": 28,
  "left_heel": 29, "right_heel": 30,
]

public class BodyShapeVisionModule: Module {
  private var landmarker: PoseLandmarker?

  public func definition() -> ModuleDefinition {
    Name("BodyShapeVision")

    AsyncFunction("detect") { (imageUri: String, maskMaxSide: Int) -> [String: Any]? in
      let image = try self.loadImage(imageUri)
      let result = try self.poseLandmarker().detect(image: try MPImage(uiImage: image))

      guard let pose = result.landmarks.first,
            let mask = result.segmentationMasks.first else {
        return nil
      }

      var landmarks: [String: [String: Double]] = [:]
      for (name, index) in landmarkIndex where index < pose.count {
        let lm = pose[index]
        landmarks[name] = [
          "x": Double(lm.x),
          "y": Double(lm.y),
          "visibility": lm.visibility?.doubleValue ?? 0,
        ]
      }

      return [
        "width": Int(image.size.width * image.scale),
        "height": Int(image.size.height * image.scale),
        "landmarks": landmarks,
        "mask": self.downscaledMask(mask, maxSide: max(64, maskMaxSide)),
        "poseCount": result.landmarks.count,
        "poseModel": modelLabel,
        "segmentationModel": modelLabel + "-mask",
      ]
    }
  }

  private func poseLandmarker() throws -> PoseLandmarker {
    if let existing = landmarker { return existing }
    guard let path = Self.modelPath() else {
      throw Exception(name: "ModelMissing", description: "\(modelName).task not found in app bundle")
    }
    let options = PoseLandmarkerOptions()
    options.baseOptions.modelAssetPath = path
    options.runningMode = .image
    options.numPoses = 2
    options.minPoseDetectionConfidence = 0.5
    options.minPosePresenceConfidence = 0.5
    options.shouldOutputSegmentationMasks = true
    let created = try PoseLandmarker(options: options)
    landmarker = created
    return created
  }

  private static func modelPath() -> String? {
    let candidates = [Bundle(for: BodyShapeVisionModule.self), Bundle.main]
    for bundle in candidates {
      if let url = bundle.url(forResource: "BodyShapeVisionModels", withExtension: "bundle"),
         let models = Bundle(url: url),
         let path = models.path(forResource: modelName, ofType: "task") {
        return path
      }
      if let path = bundle.path(forResource: modelName, ofType: "task") { return path }
    }
    return nil
  }

  /// Loads the file and redraws it upright so landmarks and mask share one orientation.
  private func loadImage(_ uri: String) throws -> UIImage {
    let path = uri.hasPrefix("file://") ? (URL(string: uri)?.path ?? uri) : uri
    guard let image = UIImage(contentsOfFile: path) else {
      throw Exception(name: "ImageUnreadable", description: "Could not read frame image")
    }
    if image.imageOrientation == .up { return image }
    let format = UIGraphicsImageRendererFormat()
    format.scale = image.scale
    return UIGraphicsImageRenderer(size: image.size, format: format).image { _ in
      image.draw(in: CGRect(origin: .zero, size: image.size))
    }
  }

  /// Person mask as 0-255 bytes (base64), longest side at most maxSide, same aspect ratio.
  private func downscaledMask(_ mask: Mask, maxSide: Int) -> [String: Any] {
    let w = mask.width
    let h = mask.height
    let scale = min(1.0, Double(maxSide) / Double(max(w, h)))
    let ow = max(1, Int((Double(w) * scale).rounded()))
    let oh = max(1, Int((Double(h) * scale).rounded()))
    let src = mask.float32Data
    var bytes = [UInt8](repeating: 0, count: ow * oh)
    for y in 0..<oh {
      let sy = min(h - 1, Int(Double(y) / scale))
      for x in 0..<ow {
        let sx = min(w - 1, Int(Double(x) / scale))
        let v = max(0, min(1, src[sy * w + sx]))
        bytes[y * ow + x] = UInt8((v * 255).rounded())
      }
    }
    return ["width": ow, "height": oh, "base64": Data(bytes).base64EncodedString()]
  }
}
