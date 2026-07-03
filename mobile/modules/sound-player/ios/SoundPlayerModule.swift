import ExpoModulesCore
import AVFoundation

public class SoundPlayerModule: Module {
  private var audioPlayer: AVAudioPlayer?

  public func definition() -> ModuleDefinition {
    Name("SoundPlayer")

    Function("playRing") {
      let sound = Bundle.main.url(forResource: "ring", withExtension: "wav")
      if let url = sound {
        self.audioPlayer = try? AVAudioPlayer(contentsOf: url)
        self.audioPlayer?.numberOfLoops = -1
        self.audioPlayer?.volume = 1.0
        self.audioPlayer?.prepareToPlay()
        self.audioPlayer?.play()
      }
    }

    Function("stopRing") {
      self.audioPlayer?.stop()
      self.audioPlayer = nil
    }

    Function("playAlert") {
      AudioServicesPlaySystemSound(1007)
    }
  }
}
