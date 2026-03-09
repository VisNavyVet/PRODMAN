import type { ParsedSection } from '../linter/types';
import type { CompiledSpec } from './types';
import type { ReadinessState } from '../linter/types';
export interface MapOptions {
    featureName: string;
    specVersion: number;
    readiness: ReadinessState;
    contextRefs: {
        product_md: string;
        users_md: string;
        tech_md: string | null;
        agent_brief_md: string;
    };
}
export declare function mapSectionsToSpec(sections: Map<string, ParsedSection>, options: MapOptions): CompiledSpec;
//# sourceMappingURL=SpecMapper.d.ts.map