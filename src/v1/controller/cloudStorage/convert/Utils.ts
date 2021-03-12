import { ConvertStep } from "../Constants";

export function determineType(resource: string): "static" | "dynamic" {
    if (resource.endsWith(".pptx")) {
        return "dynamic";
    } else {
        return "static";
    }
}

export function isConverted(convertStep: ConvertStep): boolean {
    return convertStep === ConvertStep.Done || convertStep === ConvertStep.Failed;
}
