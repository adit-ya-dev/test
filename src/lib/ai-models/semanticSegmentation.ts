export interface SegmentationResult {
  landCover: {
    forest: number;
    agricultural: number;
    urban: number;
    dominant: string;
  };
  confidence: number;
}

export class SemanticSegmenter {
  async segment(input: any): Promise<SegmentationResult> {
    return {
      landCover: {
        forest: 42.5,
        agricultural: 20.1,
        urban: 15.4,
        dominant: "forest",
      },
      confidence: 0.88,
    };
  }
}

let instance: SemanticSegmenter | null = null;
export const getSemanticSegmenter = () =>
  (instance ??= new SemanticSegmenter());
