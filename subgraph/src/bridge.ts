import { BridgeInitialized as BridgeInitializedEvent } from "../generated/Bridge/Bridge";
import { BridgeInitialized } from "../generated/schema";

export function handleBridgeInitialized(event: BridgeInitializedEvent): void {
  let entity = new BridgeInitialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sender = event.params.sender;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
