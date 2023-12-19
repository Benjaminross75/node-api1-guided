// IMPORTS AT THE TOP
const express = require('express')
const Dog = require('./dog-model')
// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())
// ENDPOINTS
server.get('/hello-world',(req, res)=>{
  res.status(200).json({ message: "hello, world" })
})
// [GET]    /             (Hello World endpoint)
server.get('/api/dogs', async (req ,res)=>{
  try{
    const dogs = await Dog.findAll()
    res.status(200).json(dogs)
  }
  catch(err){
    res.status(500).json({message: `Error fetching dogs ${err.message}`})
  }

})
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get('/api/dogs/:id', async (req, res)=>{
 try{
  const {id} = req.params
  const dog = await Dog.findById(id)
  if(!dog){
    res.status(404).json({message: `Not a valid dog Id ${id}`})
  } else{
     res.status(200).json(dog)
  }
  res.status(200).json(dog)
 }catch(err){
  res.status(500).json({
    message: `Error fetching dog ${req.params.id} : ${err.message}`
  })
 }
})
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.post('/api/dogs', async (req, res)=>{
try{
   const {name, weight} = req.body
   if(!name || !weight){
    res.status(422).json({message: 'both name and weight required'})
   } else{
    const createdDog = await Dog.create({name, weight})
    res.status(201).json({
     message: 'success creating a dog',
     data: createdDog,
    })
   }

}catch(err){
  res.status(500).json({
    message: `Error creating dog: ${err.message}`
  })
}
})
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.put('/api/dogs/:id', async (req, res)=>{
 try{
 const {id} = req.params
 const {name, weight} = req.body
 if(!name || !weight){
  res.status(422).json({message: 'both name and weight required'})
 } else {
  const updatedDog = await Dog.update(id, {name, weight})
  if(!updatedDog){
    res.status(404).json({
      message: `dog ${id} not found, sorry`
    })
  } else{
    res.status(200).json({
      message: 'you dog has been updated',
      revised: updatedDog,
     })
  }

 }

 } catch(err){
  res.status(500).json({
    message: `Error updating dog: ${err.message}`
  })
 }
})
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.delete('/api/dogs/:id', async(req, res)=>{
  try{
    const {id} = req.params
    const deletedDog = await Dog.delete(id)
    if(!deletedDog){
      res.status(404).json({
        message: `Dog id of ${id} is invalid`
      })
    }else{
      res.json({
        message: 'Dog Deleted',
        data: deletedDog,
      })
    }
  }catch(err){
    res.status(500).json({
      message: `Error deleting dog: ${err.message}`
    })
  }
})
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
