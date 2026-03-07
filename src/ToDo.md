## Todo's

# s2e12
-why do we need index , adv and disAdv of using indexes ?
-what is compound index
-$or Query

# s2e14
-read $or $and $nin $ne other query from mongoDb website

-mongo functions -> .skip()  .limit()


/feed?page=1&limit=10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => .skip(20) & .limit(10)

skip = ( page-1)* limit;