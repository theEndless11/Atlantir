declare global {
  const AGENT_MODEL: typeof import('../../server/utils/anthropic').AGENT_MODEL
  const EXECUTOR_MODEL: typeof import('../../server/utils/anthropic').EXECUTOR_MODEL
  const INTEGRATION_META: typeof import('../../server/utils/tool-registry').INTEGRATION_META
  const MAX_TOKENS: typeof import('../../server/utils/anthropic').MAX_TOKENS
  const ORCHESTRATOR_MODEL: typeof import('../../server/utils/anthropic').ORCHESTRATOR_MODEL
  const TOOL_REGISTRY: typeof import('../../server/utils/tool-registry').TOOL_REGISTRY
  const __buildAssetsURL: typeof import('../../node_modules/nuxt/dist/core/runtime/nitro/utils/paths').buildAssetsURL
  const __publicAssetsURL: typeof import('../../node_modules/nuxt/dist/core/runtime/nitro/utils/paths').publicAssetsURL
  const appendCorsHeaders: typeof import('../../node_modules/h3').appendCorsHeaders
  const appendCorsPreflightHeaders: typeof import('../../node_modules/h3').appendCorsPreflightHeaders
  const appendHeader: typeof import('../../node_modules/h3').appendHeader
  const appendHeaders: typeof import('../../node_modules/h3').appendHeaders
  const appendNotionBlock: typeof import('../../server/utils/integrations').appendNotionBlock
  const appendResponseHeader: typeof import('../../node_modules/h3').appendResponseHeader
  const appendResponseHeaders: typeof import('../../node_modules/h3').appendResponseHeaders
  const assertMethod: typeof import('../../node_modules/h3').assertMethod
  const cachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedEventHandler
  const cachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').cachedFunction
  const callNodeListener: typeof import('../../node_modules/h3').callNodeListener
  const clearResponseHeaders: typeof import('../../node_modules/h3').clearResponseHeaders
  const clearSession: typeof import('../../node_modules/h3').clearSession
  const createApp: typeof import('../../node_modules/h3').createApp
  const createAppEventHandler: typeof import('../../node_modules/h3').createAppEventHandler
  const createCalendarEvent: typeof import('../../server/utils/integrations').createCalendarEvent
  const createError: typeof import('../../node_modules/h3').createError
  const createEvent: typeof import('../../node_modules/h3').createEvent
  const createEventStream: typeof import('../../node_modules/h3').createEventStream
  const createExcelFile: typeof import('../../server/utils/integrations').createExcelFile
  const createGitHubIssue: typeof import('../../server/utils/integrations').createGitHubIssue
  const createGitHubPR: typeof import('../../server/utils/integrations').createGitHubPR
  const createOrUpdateGitHubFile: typeof import('../../server/utils/integrations').createOrUpdateGitHubFile
  const createRouter: typeof import('../../node_modules/h3').createRouter
  const defaultContentType: typeof import('../../node_modules/h3').defaultContentType
  const defineAppConfig: typeof import('../../node_modules/nuxt/dist/core/runtime/nitro/utils/config').defineAppConfig
  const defineCachedEventHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedEventHandler
  const defineCachedFunction: typeof import('../../node_modules/nitropack/dist/runtime/internal/cache').defineCachedFunction
  const defineEventHandler: typeof import('../../node_modules/h3').defineEventHandler
  const defineLazyEventHandler: typeof import('../../node_modules/h3').defineLazyEventHandler
  const defineNitroErrorHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/error/utils').defineNitroErrorHandler
  const defineNitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').defineNitroPlugin
  const defineNodeListener: typeof import('../../node_modules/h3').defineNodeListener
  const defineNodeMiddleware: typeof import('../../node_modules/h3').defineNodeMiddleware
  const defineRenderHandler: typeof import('../../node_modules/nitropack/dist/runtime/internal/renderer').defineRenderHandler
  const defineRequestMiddleware: typeof import('../../node_modules/h3').defineRequestMiddleware
  const defineResponseMiddleware: typeof import('../../node_modules/h3').defineResponseMiddleware
  const defineRouteMeta: typeof import('../../node_modules/nitropack/dist/runtime/internal/meta').defineRouteMeta
  const defineTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').defineTask
  const defineWebSocket: typeof import('../../node_modules/h3').defineWebSocket
  const defineWebSocketHandler: typeof import('../../node_modules/h3').defineWebSocketHandler
  const deleteCookie: typeof import('../../node_modules/h3').deleteCookie
  const deleteGitHubFile: typeof import('../../server/utils/integrations').deleteGitHubFile
  const dynamicEventHandler: typeof import('../../node_modules/h3').dynamicEventHandler
  const eventHandler: typeof import('../../node_modules/h3').eventHandler
  const executeTools: typeof import('../../server/utils/tool-executor').executeTools
  const fetchWithEvent: typeof import('../../node_modules/h3').fetchWithEvent
  const fromNodeMiddleware: typeof import('../../node_modules/h3').fromNodeMiddleware
  const fromPlainHandler: typeof import('../../node_modules/h3').fromPlainHandler
  const fromWebHandler: typeof import('../../node_modules/h3').fromWebHandler
  const getConnectedTools: typeof import('../../server/utils/tool-registry').getConnectedTools
  const getCookie: typeof import('../../node_modules/h3').getCookie
  const getGitHubCommitDetail: typeof import('../../server/utils/integrations').getGitHubCommitDetail
  const getGitHubCommits: typeof import('../../server/utils/integrations').getGitHubCommits
  const getGitHubRepoInfo: typeof import('../../server/utils/integrations').getGitHubRepoInfo
  const getHeader: typeof import('../../node_modules/h3').getHeader
  const getHeaders: typeof import('../../node_modules/h3').getHeaders
  const getMethod: typeof import('../../node_modules/h3').getMethod
  const getProxyRequestHeaders: typeof import('../../node_modules/h3').getProxyRequestHeaders
  const getQuery: typeof import('../../node_modules/h3').getQuery
  const getRequestFingerprint: typeof import('../../node_modules/h3').getRequestFingerprint
  const getRequestHeader: typeof import('../../node_modules/h3').getRequestHeader
  const getRequestHeaders: typeof import('../../node_modules/h3').getRequestHeaders
  const getRequestHost: typeof import('../../node_modules/h3').getRequestHost
  const getRequestIP: typeof import('../../node_modules/h3').getRequestIP
  const getRequestPath: typeof import('../../node_modules/h3').getRequestPath
  const getRequestProtocol: typeof import('../../node_modules/h3').getRequestProtocol
  const getRequestURL: typeof import('../../node_modules/h3').getRequestURL
  const getRequestWebStream: typeof import('../../node_modules/h3').getRequestWebStream
  const getResponseHeader: typeof import('../../node_modules/h3').getResponseHeader
  const getResponseHeaders: typeof import('../../node_modules/h3').getResponseHeaders
  const getResponseStatus: typeof import('../../node_modules/h3').getResponseStatus
  const getResponseStatusText: typeof import('../../node_modules/h3').getResponseStatusText
  const getRouteRules: typeof import('../../node_modules/nitropack/dist/runtime/internal/route-rules').getRouteRules
  const getRouterParam: typeof import('../../node_modules/h3').getRouterParam
  const getRouterParams: typeof import('../../node_modules/h3').getRouterParams
  const getSession: typeof import('../../node_modules/h3').getSession
  const getToolsForIntegration: typeof import('../../server/utils/tool-registry').getToolsForIntegration
  const getValidatedQuery: typeof import('../../node_modules/h3').getValidatedQuery
  const getValidatedRouterParams: typeof import('../../node_modules/h3').getValidatedRouterParams
  const handleCacheHeaders: typeof import('../../node_modules/h3').handleCacheHeaders
  const handleCors: typeof import('../../node_modules/h3').handleCors
  const isCorsOriginAllowed: typeof import('../../node_modules/h3').isCorsOriginAllowed
  const isError: typeof import('../../node_modules/h3').isError
  const isEvent: typeof import('../../node_modules/h3').isEvent
  const isEventHandler: typeof import('../../node_modules/h3').isEventHandler
  const isMethod: typeof import('../../node_modules/h3').isMethod
  const isPreflightRequest: typeof import('../../node_modules/h3').isPreflightRequest
  const isStream: typeof import('../../node_modules/h3').isStream
  const isWebResponse: typeof import('../../node_modules/h3').isWebResponse
  const lazyEventHandler: typeof import('../../node_modules/h3').lazyEventHandler
  const listGitHubBranches: typeof import('../../server/utils/integrations').listGitHubBranches
  const listGitHubFiles: typeof import('../../server/utils/integrations').listGitHubFiles
  const listGitHubIssues: typeof import('../../server/utils/integrations').listGitHubIssues
  const listGitHubPRs: typeof import('../../server/utils/integrations').listGitHubPRs
  const listGitHubUserRepos: typeof import('../../server/utils/integrations').listGitHubUserRepos
  const nitroPlugin: typeof import('../../node_modules/nitropack/dist/runtime/internal/plugin').nitroPlugin
  const parseCassandraUrl: typeof import('../../server/utils/cassandra-parse').parseCassandraUrl
  const parseCookies: typeof import('../../node_modules/h3').parseCookies
  const promisifyNodeListener: typeof import('../../node_modules/h3').promisifyNodeListener
  const proxyRequest: typeof import('../../node_modules/h3').proxyRequest
  const readBody: typeof import('../../node_modules/h3').readBody
  const readFormData: typeof import('../../node_modules/h3').readFormData
  const readGitHubFile: typeof import('../../server/utils/integrations').readGitHubFile
  const readMultipartFormData: typeof import('../../node_modules/h3').readMultipartFormData
  const readRawBody: typeof import('../../node_modules/h3').readRawBody
  const readValidatedBody: typeof import('../../node_modules/h3').readValidatedBody
  const removeResponseHeader: typeof import('../../node_modules/h3').removeResponseHeader
  const runTask: typeof import('../../node_modules/nitropack/dist/runtime/internal/task').runTask
  const sanitizeStatusCode: typeof import('../../node_modules/h3').sanitizeStatusCode
  const sanitizeStatusMessage: typeof import('../../node_modules/h3').sanitizeStatusMessage
  const sealSession: typeof import('../../node_modules/h3').sealSession
  const searchGitHubCode: typeof import('../../server/utils/integrations').searchGitHubCode
  const send: typeof import('../../node_modules/h3').send
  const sendError: typeof import('../../node_modules/h3').sendError
  const sendGmail: typeof import('../../server/utils/integrations').sendGmail
  const sendIterable: typeof import('../../node_modules/h3').sendIterable
  const sendNoContent: typeof import('../../node_modules/h3').sendNoContent
  const sendProxy: typeof import('../../node_modules/h3').sendProxy
  const sendRedirect: typeof import('../../node_modules/h3').sendRedirect
  const sendSlack: typeof import('../../server/utils/integrations').sendSlack
  const sendStream: typeof import('../../node_modules/h3').sendStream
  const sendWebResponse: typeof import('../../node_modules/h3').sendWebResponse
  const serveStatic: typeof import('../../node_modules/h3').serveStatic
  const setCookie: typeof import('../../node_modules/h3').setCookie
  const setHeader: typeof import('../../node_modules/h3').setHeader
  const setHeaders: typeof import('../../node_modules/h3').setHeaders
  const setResponseHeader: typeof import('../../node_modules/h3').setResponseHeader
  const setResponseHeaders: typeof import('../../node_modules/h3').setResponseHeaders
  const setResponseStatus: typeof import('../../node_modules/h3').setResponseStatus
  const splitCookiesString: typeof import('../../node_modules/h3').splitCookiesString
  const toAnthropicTool: typeof import('../../server/utils/tool-registry').toAnthropicTool
  const toEventHandler: typeof import('../../node_modules/h3').toEventHandler
  const toNodeListener: typeof import('../../node_modules/h3').toNodeListener
  const toPlainHandler: typeof import('../../node_modules/h3').toPlainHandler
  const toWebHandler: typeof import('../../node_modules/h3').toWebHandler
  const toWebRequest: typeof import('../../node_modules/h3').toWebRequest
  const triggerZapier: typeof import('../../server/utils/integrations').triggerZapier
  const unsealSession: typeof import('../../node_modules/h3').unsealSession
  const updateGitHubIssue: typeof import('../../server/utils/integrations').updateGitHubIssue
  const updateSession: typeof import('../../node_modules/h3').updateSession
  const useAnthropic: typeof import('../../server/utils/anthropic').useAnthropic
  const useAppConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useAppConfig
  const useBase: typeof import('../../node_modules/h3').useBase
  const useEvent: typeof import('../../node_modules/nitropack/dist/runtime/internal/context').useEvent
  const useNitroApp: typeof import('../../node_modules/nitropack/dist/runtime/internal/app').useNitroApp
  const useRuntimeConfig: typeof import('../../node_modules/nitropack/dist/runtime/internal/config').useRuntimeConfig
  const useSession: typeof import('../../node_modules/h3').useSession
  const useStorage: typeof import('../../node_modules/nitropack/dist/runtime/internal/storage').useStorage
  const useSupabaseAdmin: typeof import('../../server/utils/supabase').useSupabaseAdmin
  const writeEarlyHints: typeof import('../../node_modules/h3').writeEarlyHints
  const writeNotionPage: typeof import('../../server/utils/integrations').writeNotionPage
}
// for type re-export
declare global {
  // @ts-ignore
  export type { ToolCall, ToolResult } from '../../server/utils/tool-executor'
  import('../../server/utils/tool-executor')
  // @ts-ignore
  export type { ToolDef } from '../../server/utils/tool-registry'
  import('../../server/utils/tool-registry')
}
export { useNitroApp } from 'nitropack/runtime/internal/app';
export { useRuntimeConfig, useAppConfig } from 'nitropack/runtime/internal/config';
export { defineNitroPlugin, nitroPlugin } from 'nitropack/runtime/internal/plugin';
export { defineCachedFunction, defineCachedEventHandler, cachedFunction, cachedEventHandler } from 'nitropack/runtime/internal/cache';
export { useStorage } from 'nitropack/runtime/internal/storage';
export { defineRenderHandler } from 'nitropack/runtime/internal/renderer';
export { defineRouteMeta } from 'nitropack/runtime/internal/meta';
export { getRouteRules } from 'nitropack/runtime/internal/route-rules';
export { useEvent } from 'nitropack/runtime/internal/context';
export { defineTask, runTask } from 'nitropack/runtime/internal/task';
export { defineNitroErrorHandler } from 'nitropack/runtime/internal/error/utils';
export { appendCorsHeaders, appendCorsPreflightHeaders, appendHeader, appendHeaders, appendResponseHeader, appendResponseHeaders, assertMethod, callNodeListener, clearResponseHeaders, clearSession, createApp, createAppEventHandler, createError, createEvent, createEventStream, createRouter, defaultContentType, defineEventHandler, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, defineWebSocketHandler, deleteCookie, dynamicEventHandler, eventHandler, fetchWithEvent, fromNodeMiddleware, fromPlainHandler, fromWebHandler, getCookie, getHeader, getHeaders, getMethod, getProxyRequestHeaders, getQuery, getRequestFingerprint, getRequestHeader, getRequestHeaders, getRequestHost, getRequestIP, getRequestPath, getRequestProtocol, getRequestURL, getRequestWebStream, getResponseHeader, getResponseHeaders, getResponseStatus, getResponseStatusText, getRouterParam, getRouterParams, getSession, getValidatedQuery, getValidatedRouterParams, handleCacheHeaders, handleCors, isCorsOriginAllowed, isError, isEvent, isEventHandler, isMethod, isPreflightRequest, isStream, isWebResponse, lazyEventHandler, parseCookies, promisifyNodeListener, proxyRequest, readBody, readFormData, readMultipartFormData, readRawBody, readValidatedBody, removeResponseHeader, sanitizeStatusCode, sanitizeStatusMessage, sealSession, send, sendError, sendIterable, sendNoContent, sendProxy, sendRedirect, sendStream, sendWebResponse, serveStatic, setCookie, setHeader, setHeaders, setResponseHeader, setResponseHeaders, setResponseStatus, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest, unsealSession, updateSession, useBase, useSession, writeEarlyHints } from 'h3';
export { buildAssetsURL as __buildAssetsURL, publicAssetsURL as __publicAssetsURL } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/nuxt/dist/core/runtime/nitro/utils/paths';
export { defineAppConfig } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/node_modules/nuxt/dist/core/runtime/nitro/utils/config';
export { useAnthropic, ORCHESTRATOR_MODEL, AGENT_MODEL, EXECUTOR_MODEL, MAX_TOKENS } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/anthropic';
export { parseCassandraUrl } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/cassandra-parse';
export { sendSlack, listGitHubUserRepos, getGitHubRepoInfo, listGitHubFiles, readGitHubFile, getGitHubCommits, getGitHubCommitDetail, listGitHubBranches, listGitHubIssues, listGitHubPRs, searchGitHubCode, createGitHubIssue, updateGitHubIssue, createOrUpdateGitHubFile, deleteGitHubFile, createGitHubPR, sendGmail, createCalendarEvent, triggerZapier, createExcelFile, writeNotionPage, appendNotionBlock } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/integrations';
export { useSupabaseAdmin } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/supabase';
export { executeTools } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/tool-executor';
export { TOOL_REGISTRY, getToolsForIntegration, getConnectedTools, toAnthropicTool, INTEGRATION_META } from 'C:/Users/Lenovo/Downloads/atlantir-bot-fixed/server/utils/tool-registry';