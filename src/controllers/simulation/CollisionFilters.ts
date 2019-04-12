import { b2Filter } from "../../../lib/box2d-physics-engine/Dynamics/b2Fixture";

let worldCollisionFilter = new b2Filter();
// The collision category of this filter
worldCollisionFilter.categoryBits = 0x0002;
// The categories to accept collisions from
worldCollisionFilter.maskBits =  0x0002;
// -1 for no collisions
worldCollisionFilter.groupIndex =  0;

let weaponCollisionFilter = new b2Filter();
// The collision category of this filter
worldCollisionFilter.categoryBits = 0x0004;
// The categories to accept collisions from
worldCollisionFilter.maskBits = 0x0004;
// -1 for no collisions
worldCollisionFilter.groupIndex =  0;

export {worldCollisionFilter, weaponCollisionFilter};