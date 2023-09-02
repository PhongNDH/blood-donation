import { loadFull } from "tsparticles";
import { particlesOptions } from "../../sources/particlesConfig.js";
import Particles from "react-tsparticles";
import { memo } from "react";

const ParticleSystem = () => {
  const particlesInit = (engine) => {
    loadFull(engine);
  };
  return (
    <Particles
      className="navigation-particles"
      init={particlesInit}
      options={particlesOptions}
    />
  );
};

export default memo(ParticleSystem);
