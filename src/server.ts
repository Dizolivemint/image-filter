import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Filtered Image Endpoint
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    const { image_url } = req.query
    const files: Array<string> = []

    // 1. Validate the image query
    if (!image_url) res.status(400).send("try /filteredimage?image_url=https://picsum.photos/200")

    // 2. Call filterImageFromURL(image_url) to filter the image
    filterImageFromURL(`${image_url}`)
      .then(file => {
        // 3. Send the resulting file in the response
        res.sendFile(file, err => {
          if (err) res.status(422).send('An error occured while sending the file')
          else try {
            files.push(file)
            deleteLocalFiles(files) // 4. Deletes any files on the server on finish of the response
          } catch (err) {
            console.log('Error removing file')
          }
        })
      }) 
      .catch(e => res.status(422).send('An error occured while attempting to process the file. Not all images will work. Try /filteredimage?image_url=https://picsum.photos/200'))
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();