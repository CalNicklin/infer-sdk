import { type InferConfig, type ZeroShotResponse, type ZeroShotOptions } from './types';
declare class Infer {
    private apiKey;
    private baseUrl;
    constructor(config: InferConfig);
    private handleResponse;
    get zeroShot(): {
        classify: (text: string, labels: string[], options?: ZeroShotOptions) => Promise<ZeroShotResponse>;
    };
}
export default Infer;
//# sourceMappingURL=infer.d.ts.map