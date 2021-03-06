import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import {extensionPoint} from '@loopback/core';
import {
  QueueBindings,
  QUEUE_CONSUMER,
  RABBIT_CONSUME_METADATA_ACCESSOR,
} from '../keys';
import {RabbitQueueMetadata} from '../types';

/**
 * An extension point for greeters that can greet in different languages
 */
@extensionPoint(QUEUE_CONSUMER)
export class RabbitConsumeMetadataProvider
  implements Provider<RabbitQueueMetadata | undefined> {
  constructor(
    @inject(QueueBindings.CONSUMER_CLASS, {optional: true})
    private readonly consumerClass: Constructor<{}>,
    @inject(QueueBindings.CONSUMER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
  ) {}

  value(): RabbitQueueMetadata | undefined {
    console.log('this: ', this);
    if (!this.consumerClass || !this.methodName) return;
    return getRabbitConsumeMetadata(this.consumerClass, this.methodName);
  }
}

export function getRabbitConsumeMetadata(
  consumerClass: Constructor<{}>,
  methodName: string,
): RabbitQueueMetadata | undefined {
  return MetadataInspector.getMethodMetadata<RabbitQueueMetadata>(
    RABBIT_CONSUME_METADATA_ACCESSOR,
    consumerClass.prototype,
    methodName,
  );
}
