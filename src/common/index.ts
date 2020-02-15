import { JSONObject } from '@/types'
import AudioEngineInterface from '@/audio-engine'

// PATHS

const URL_DOUBLE_SLASHES_REGEX = /([^:]\/)\/+/g
const URL_TRAILING_SLASH_REGEX = /\/$/

export function pathJoin(a: string = '', b: string = ''): string {
  let result: string
  result = a.trim() + '/' + b.trim()
  result = result.replace(URL_DOUBLE_SLASHES_REGEX, '')
  return result
}

export function sanitizeFilepath(a: string = ''): string {
  let result: string
  result = a.trim()
  result = result.replace(URL_DOUBLE_SLASHES_REGEX, '')
  result = result.replace(URL_TRAILING_SLASH_REGEX, '')
  return result
}

// ARRAYS

export function splitArrayInChunks<T extends Array<any>>(a: T, s: number): T[] {
  const o: any = []
  for (let i = 0; i < a.length; i += s) o.push(a.slice(i, i + s))
  return o
}

// FETCH

export async function fetchJSON(path: string): Promise<JSONObject> {
  const response: Response = await fetch(sanitizeFilepath(path))
  const json: Record<string, unknown> = await response.json()
  return json
}

export async function fetchAudio(
  path: string,
  audioContext: {
    [key: string]: any
    decodeAudioData: AudioEngineInterface['decodeAudioData']
  }
): Promise<AudioBuffer> {
  const response: Response = await fetch(sanitizeFilepath(path))
  const arrayBuffer: ArrayBuffer = await response.arrayBuffer()
  const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(
    arrayBuffer
  )
  return audioBuffer
}

/*
// 1- build the graph (todo)
//2 - RESOLVE THE GRAPH  :
  // How should i found cycle in the directed graph and list out the node which forming the cycle?
  https://stackoverflow.com/questions/45716526/how-should-i-found-cycle-in-the-directed-graph-and-list-out-the-node-which-formi
function getCycle(graph) {
  // Copy the graph, converting all node references to String
  graph = Object.assign(
    ...Object.keys(graph).map(node => ({ [node]: graph[node].map(String) }))
  )
  let queue = Object.keys(graph).map(node => [node])
  while (queue.length) {
    const batch = []
    for (const path of queue) {
      const parents = graph[path[0]] || []
      for (const node of parents) {
        if (node === path[path.length - 1]) return [node, ...path]
        batch.push([node, ...path])
      }
    }
    queue = batch
  }
}

// First example
const graph = {
  a: ['b', 'c'],
  b: ['d', 'c'],
  e: ['a', 'b'],
  d: ['e']
}
const result = getCycle(graph)
*/
