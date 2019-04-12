import { b2Filter } from "../../../lib/box2d-physics-engine/Dynamics/b2Fixture";

let worldCollisionFilter = new b2Filter();
// The collision category of this filter
worldCollisionFilter.categoryBits = parseInt("00000010", 2);
// The categories to accept collisions from
worldCollisionFilter.maskBits =  parseInt("00000011", 2);
// -1 for no collisions
worldCollisionFilter.groupIndex =  0;

let weaponCollisionFilter = new b2Filter();
// The collision category of this filter
worldCollisionFilter.categoryBits = parseInt("00000100", 2);
// The categories to accept collisions from
worldCollisionFilter.maskBits =  parseInt("0000101", 2);
// -1 for no collisions
worldCollisionFilter.groupIndex =  0;

export {worldCollisionFilter, weaponCollisionFilter};