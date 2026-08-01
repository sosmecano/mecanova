Pod::Spec.new do |s|
  s.name = 'SoundPlayer'
  s.version = '1.0.0'
  s.summary = 'SoundPlayer module for Mecanova'
  s.license = 'MIT'
  s.author = 'Mecanova'
  s.homepage = 'https://mecanova.com'
  s.platforms = { :ios => '16.4' }
  s.source = { :git => 'https://github.com/mecanova/mobile.git' }
  s.swift_version = '5.4'
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '*.swift'
  s.resource_bundles = {
    'SoundPlayer' => ['*.wav']
  }
end
