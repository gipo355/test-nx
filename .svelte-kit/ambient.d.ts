
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const PATH: string;
	export const SHELL: string;
	export const LSCOLORS: string;
	export const COLORTERM: string;
	export const VPS_PORT: string;
	export const LESS: string;
	export const XDG_SESSION_PATH: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TMUX: string;
	export const I3SOCK: string;
	export const WEZTERM_CONFIG_DIR: string;
	export const LC_ADDRESS: string;
	export const TMUX_FZF_LAUNCH_KEY: string;
	export const DOTNET_ROOT: string;
	export const LC_NAME: string;
	export const GRADLE_HOME: string;
	export const TMUX_PLUGIN_MANAGER_PATH: string;
	export const OPENAI_API_KEY: string;
	export const WEZTERM_EXECUTABLE: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const CONDA_CHANGEPS1: string;
	export const EDITOR: string;
	export const GTK_MODULES: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const XDG_SESSION_TYPE: string;
	export const PNPM_HOME: string;
	export const NODE_ENV: string;
	export const XAUTHORITY: string;
	export const DESKTOP_STARTUP_ID: string;
	export const INFISICAL_TOKEN: string;
	export const FZF_DEFAULT_COMMAND: string;
	export const CR_PAT: string;
	export const ASDF_DEFAULT_TOOL_VERSIONS_FILENAME: string;
	export const ZSH_TMUX_CONFIG: string;
	export const MOTD_SHOWN: string;
	export const HOME: string;
	export const LC_PAPER: string;
	export const LANG: string;
	export const INFISICAL_TOKEN_FOR_FASTIFY: string;
	export const WEZTERM_UNIX_SOCKET: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const _ZSH_TMUX_FIXED_CONFIG: string;
	export const VIRTUAL_ENV_DISABLE_PROMPT: string;
	export const XDG_SEAT_PATH: string;
	export const ASDF_DATA_DIR: string;
	export const GOROOT: string;
	export const DOTNET_BUNDLE_EXTRACT_BASE_DIR: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const LC_IDENTIFICATION: string;
	export const ZSH: string;
	export const FZF_CTRL_T_COMMAND: string;
	export const INFISICAL_TOKEN_FOR_COURSES_PNPM: string;
	export const ASDF_DIR: string;
	export const USER: string;
	export const TMUX_PANE: string;
	export const FZF_ALT_C_COMMAND: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const VISUAL: string;
	export const PROMPT_EOL_MARK: string;
	export const DISPLAY: string;
	export const SHLVL: string;
	export const BW_SESSION: string;
	export const PAGER: string;
	export const LC_TELEPHONE: string;
	export const LC_MEASUREMENT: string;
	export const XDG_VTNR: string;
	export const XDG_SESSION_ID: string;
	export const DIRHISTORY_SIZE: string;
	export const WEZTERM_CONFIG_FILE: string;
	export const XDG_RUNTIME_DIR: string;
	export const ZSH_TMUX_TERM: string;
	export const NODE_PATH: string;
	export const DENO_DEPLOY_TOKEN: string;
	export const DEBUGINFOD_URLS: string;
	export const LC_TIME: string;
	export const GTK3_MODULES: string;
	export const BROWSER: string;
	export const ASDF_CONFIG_FILE: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const FZF_DEFAULT_OPTS: string;
	export const MAIL: string;
	export const LC_NUMERIC: string;
	export const WEZTERM_PANE: string;
	export const OLDPWD: string;
	export const VPS_IP: string;
	export const TERM_PROGRAM: string;
	export const WEZTERM_EXECUTABLE_DIR: string;
	export const NX_CLI_SET: string;
	export const NX_LOAD_DOT_ENV_FILES: string;
	export const NX_INVOKED_BY_RUNNER: string;
	export const NX_WORKSPACE_ROOT: string;
	export const NX_TERMINAL_OUTPUT_PATH: string;
	export const NX_STREAM_OUTPUT: string;
	export const NX_TASK_TARGET_PROJECT: string;
	export const NX_TASK_TARGET_TARGET: string;
	export const NX_TASK_TARGET_CONFIGURATION: string;
	export const NX_TASK_HASH: string;
	export const LERNA_PACKAGE_NAME: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		PATH: string;
		SHELL: string;
		LSCOLORS: string;
		COLORTERM: string;
		VPS_PORT: string;
		LESS: string;
		XDG_SESSION_PATH: string;
		TERM_PROGRAM_VERSION: string;
		TMUX: string;
		I3SOCK: string;
		WEZTERM_CONFIG_DIR: string;
		LC_ADDRESS: string;
		TMUX_FZF_LAUNCH_KEY: string;
		DOTNET_ROOT: string;
		LC_NAME: string;
		GRADLE_HOME: string;
		TMUX_PLUGIN_MANAGER_PATH: string;
		OPENAI_API_KEY: string;
		WEZTERM_EXECUTABLE: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		CONDA_CHANGEPS1: string;
		EDITOR: string;
		GTK_MODULES: string;
		XDG_SEAT: string;
		PWD: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		XDG_SESSION_TYPE: string;
		PNPM_HOME: string;
		NODE_ENV: string;
		XAUTHORITY: string;
		DESKTOP_STARTUP_ID: string;
		INFISICAL_TOKEN: string;
		FZF_DEFAULT_COMMAND: string;
		CR_PAT: string;
		ASDF_DEFAULT_TOOL_VERSIONS_FILENAME: string;
		ZSH_TMUX_CONFIG: string;
		MOTD_SHOWN: string;
		HOME: string;
		LC_PAPER: string;
		LANG: string;
		INFISICAL_TOKEN_FOR_FASTIFY: string;
		WEZTERM_UNIX_SOCKET: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		_ZSH_TMUX_FIXED_CONFIG: string;
		VIRTUAL_ENV_DISABLE_PROMPT: string;
		XDG_SEAT_PATH: string;
		ASDF_DATA_DIR: string;
		GOROOT: string;
		DOTNET_BUNDLE_EXTRACT_BASE_DIR: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		LC_IDENTIFICATION: string;
		ZSH: string;
		FZF_CTRL_T_COMMAND: string;
		INFISICAL_TOKEN_FOR_COURSES_PNPM: string;
		ASDF_DIR: string;
		USER: string;
		TMUX_PANE: string;
		FZF_ALT_C_COMMAND: string;
		PAM_KWALLET5_LOGIN: string;
		VISUAL: string;
		PROMPT_EOL_MARK: string;
		DISPLAY: string;
		SHLVL: string;
		BW_SESSION: string;
		PAGER: string;
		LC_TELEPHONE: string;
		LC_MEASUREMENT: string;
		XDG_VTNR: string;
		XDG_SESSION_ID: string;
		DIRHISTORY_SIZE: string;
		WEZTERM_CONFIG_FILE: string;
		XDG_RUNTIME_DIR: string;
		ZSH_TMUX_TERM: string;
		NODE_PATH: string;
		DENO_DEPLOY_TOKEN: string;
		DEBUGINFOD_URLS: string;
		LC_TIME: string;
		GTK3_MODULES: string;
		BROWSER: string;
		ASDF_CONFIG_FILE: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		FZF_DEFAULT_OPTS: string;
		MAIL: string;
		LC_NUMERIC: string;
		WEZTERM_PANE: string;
		OLDPWD: string;
		VPS_IP: string;
		TERM_PROGRAM: string;
		WEZTERM_EXECUTABLE_DIR: string;
		NX_CLI_SET: string;
		NX_LOAD_DOT_ENV_FILES: string;
		NX_INVOKED_BY_RUNNER: string;
		NX_WORKSPACE_ROOT: string;
		NX_TERMINAL_OUTPUT_PATH: string;
		NX_STREAM_OUTPUT: string;
		NX_TASK_TARGET_PROJECT: string;
		NX_TASK_TARGET_TARGET: string;
		NX_TASK_TARGET_CONFIGURATION: string;
		NX_TASK_HASH: string;
		LERNA_PACKAGE_NAME: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
