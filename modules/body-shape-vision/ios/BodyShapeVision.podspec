require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'BodyShapeVision'
  s.version        = package['version']
  s.summary        = 'On-device pose landmarks and person mask for body-shape capture'
  s.description    = 'MediaPipe Pose Landmarker (with segmentation mask) on still images. Images never leave the phone.'
  s.license        = 'UNLICENSED'
  s.author         = 'Kale'
  s.homepage       = 'https://kale.insure'
  s.platforms      = { :ios => '16.4' }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'MediaPipeTasksVision', '0.10.21'

  # The pose model ships inside the app (no download at runtime).
  s.resource_bundles = { 'BodyShapeVisionModels' => ['Models/*.task'] }

  s.source_files = '**/*.{h,m,swift}'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
