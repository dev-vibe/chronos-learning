import sharp from 'sharp';
for (const [name,source] of [['street-reconstruction','street-reconstruction-final.png'],['reservoir-reconstruction','reservoir-reconstruction-master.png']]) {
 await sharp('docs/research/indus-media/'+source).resize({width:960,withoutEnlargement:true}).jpeg({quality:97,chromaSubsampling:'4:4:4'}).toFile('public/images/indus/'+name+'.jpg');
}
