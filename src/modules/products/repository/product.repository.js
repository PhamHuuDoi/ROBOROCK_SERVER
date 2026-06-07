const prisma = require('../../../config/prisma');

async function findMany({skip=0, take=10,search,categoryId}){
    const where = {AND: []};
    if(search){
        where.AND.push({
             OR: [
                { name: {constains: search, mode: 'insensitive'} },
                {slug: {constains: search, mode: 'insensitive'} },
                {sku: {constains: search, mode: 'insensitive'} },
             ],
        });

    }
    if(categoryId){
        where.AND.push({categoryId: Number(categoryId)});
    }
    const filter=where.AND.length > 0 ? {where} : {};
    const [items,total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take,
            ...filter,
            orderBy: {createdAt: 'desc'},
        }),
        prisma.product.count(filter),
    ]);
    return {items,total};
}
async function findById(id) {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true, images: true },
  });
}
module.exports={findMany, findById};
