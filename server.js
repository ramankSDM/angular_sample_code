const express = require('express');
path = require('path');

const app = express();
// settings
//console.log('file data--->',path.join(__dirname, '../../uploads/ab9afa5d9f14778cb3067c349cd4e571.jpg'))
app.set('port', process.env.PORT || 6072);
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
}); 

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});
