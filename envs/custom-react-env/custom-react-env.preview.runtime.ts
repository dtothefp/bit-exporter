/* eslint max-len:0,@typescript-eslint/no-unused-vars:0 */
import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';
// uncomment the line below and install the theme if you want to use our theme or create your own and import it here
// import { ThemeCompositions } from '@teambit/documenter.theme.theme-compositions';

import { CustomReactEnvAspect } from './custom-react-env.aspect';

export class CustomReactEnvPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const customReactEnvPreviewMain = new CustomReactEnvPreviewMain();
    // uncomment the line below to register a new provider to wrap all compositions using this environment with a custom theme.
    // react.registerProvider([ThemeCompositions]);

    return customReactEnvPreviewMain;
  }
}

CustomReactEnvAspect.addRuntime(CustomReactEnvPreviewMain);
