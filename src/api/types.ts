import { Centrifuge, State } from "centrifuge"


export type StatusType = State | "error"

export type FeedsResponse = {
    bids?: [];
    asks?: [];
}

export type WSProviderType = {
    centrifuge: Centrifuge | undefined ;
    status: StatusType
}