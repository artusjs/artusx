import { addTag, Injectable, ScopeEnum } from '@artus/core';
import { EventMetadata, NamespaceMetadata } from './types';

export const CLASS_NAMESPACE_TAG = 'CLASS_NAMESPACE_TAG';
export const CLASS_NAMESPACE_METADATA = Symbol.for('CLASS_NAMESPACE_METADATA');
export const EVENT_METADATA = Symbol.for('EVENT_METADATA');

export function Namespace(name: string) {
  return (target: any) => {
    const namespaceMetadata: NamespaceMetadata = {
      name,
    };

    Reflect.defineMetadata(CLASS_NAMESPACE_METADATA, namespaceMetadata, target);
    addTag(CLASS_NAMESPACE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function Event(name: string) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const eventMetadata: EventMetadata = {
      name,
    };

    Reflect.defineMetadata(EVENT_METADATA, eventMetadata, descriptor.value);
    return descriptor;
  };
}
