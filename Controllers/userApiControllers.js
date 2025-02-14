

const { where } = require('sequelize');
const {curatedList: curatedListModel} = require('../models');

const createCuratedList = async(req,res)=>{
    try{
        const {name, description, slug} = req.body;

        if(!name || !description || !slug ){
            return res.status(404).json({message: "Check the request body again!"});
        }

        const curateList = await curatedListModel.create({name, description, slug});

        return res.status(200).json({message: 'Curated list created successfully.'});

    }catch(error){
    return res.status(500).json({message:"Internal Server Error!", error: error.message});
    }
};

const updateCuratedList = async(req,res)=>{
    try{
        const {curatedListId} = req.params;
        const {name, description} = req.body;

        const updateCurateList = await curatedListModel.update(
            {name, description},
            {where: {id: curatedListId}}
        );

        return res.status(200).json({message: 'Curated list updated successfully.',updateCurateList});

    }catch(error){
        return res.status(500).json({message : 'Internal Server Error!', error: error.message});
    }
}

module.exports = {createCuratedList, updateCuratedList};