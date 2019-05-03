import { b2Filter } from "../../../lib/box2d-physics-engine/Dynamics/b2Fixture";

let worldCollisionFilter = new b2Filter();
// The collision category of this filter
worldCollisionFilter.categoryBits = 0b00010;
// The categories to accept collisions from
worldCollisionFilter.maskBits = 0b10010;
// -1 for no collisions
worldCollisionFilter.groupIndex =  0;

let hitboxCollisionFilter = new b2Filter();
// The collision category of this filter
hitboxCollisionFilter.categoryBits = 0b00100;
// The categories to accept collisions from
hitboxCollisionFilter.maskBits = 0b01000;
// -1 for no collisions
hitboxCollisionFilter.groupIndex =  0;

let weaponCollisionFilter = new b2Filter();
// The collision category of this filter
weaponCollisionFilter.categoryBits = 0b01000;
// The categories to accept collisions from
weaponCollisionFilter.maskBits = 0b10100;
// -1 for no collisions
weaponCollisionFilter.groupIndex =  0;

let worldAndHitboxCollisionFilter = new b2Filter();
// The collision category of this filter
worldAndHitboxCollisionFilter.categoryBits = 0b10000;
// The categories to accept collisions from
worldAndHitboxCollisionFilter.maskBits = 0b01010;
// -1 for no collisions
worldAndHitboxCollisionFilter.groupIndex =  0;

let worldBorderCollisionFilter = new b2Filter();
// The collision category of this filter
worldBorderCollisionFilter.categoryBits = 0b100000;
// The categories to accept collisions from
worldBorderCollisionFilter.maskBits = 0b100000;
// -1 for no collisions
worldBorderCollisionFilter.groupIndex =  0;

export { worldCollisionFilter, hitboxCollisionFilter, weaponCollisionFilter, worldAndHitboxCollisionFilter, worldBorderCollisionFilter };