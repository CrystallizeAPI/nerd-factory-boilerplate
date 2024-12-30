import { ClientInterface } from "@crystallize/js-api-client"

type Deps = {
  client: ClientInterface
}
type Args = {
  orderId: string
  pipelineId: string
  stageId: string
}

export const putOrderInPipelineStage = async ({ orderId, pipelineId, stageId }: Args, { client }: Deps) => {
  await client.pimApi(`#graphql
        mutation {
            order {
                setPipelineStage(orderId: "${orderId}", pipelineId: "${pipelineId}", stageId: "${stageId}") {
                    id
                }
            }
        }    
    `)
}
