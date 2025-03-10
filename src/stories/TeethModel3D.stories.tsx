import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Canvas } from "@react-three/fiber";
import { TeethModel3D } from "../components/TeethModel3D";

// TeethModel stories
const teethModelMeta = {
  title: "Components/TeethModelV2",
  component: TeethModel3D,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onToothClick: fn(),

  },
} satisfies Meta<typeof TeethModel3D>;

export const TeethModelMeta = teethModelMeta;

type TeethModelStory = StoryObj<typeof teethModelMeta>;

// For 3D components, we need to wrap them in a Canvas
export const DefaultTeethModel: TeethModelStory = {
  render: (args) => (
    <div style={{ width: "600px", height: "400px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]} />
        <TeethModel3D {...args} />
      </Canvas>
    </div>
  ),
};

export const WithClickHandler: TeethModelStory = {
  args: {
    onToothClick: fn(),
  },
  render: (args) => (
    <div style={{ width: "600px", height: "400px" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TeethModel3D {...args} />
      </Canvas>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "TeethModel with a click handler that will show up in the Actions panel when a tooth is clicked.",
      },
    },
  },
};

export default teethModelMeta;
