const Tour = require('../models/tourModel');

// const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

exports.getAllTours = async (req, res) => {
  try {
    //build query
    //Filering
    const queryObj = { ...req.query };
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach((element) => delete queryObj[element]);

    var query = Tour.find(queryObj);

    //sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createAt');
    }

    //limitation

    if (req.query.field) {
      const field = req.query.field.split(',').join(' ');
      query = query.select(field);
    } else {
      query = query.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skipValue = (page - 1) * limit;

    query = query.skip(skipValue).limit(limit);
    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      if (numTour <= skipValue) {
        throw new Error('this page not exit');
      }
    }

    //execute query

    const tours = await query;

    //response

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {}
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: `tour ${req.params.id} has been deleted`,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      error: error,
    });
  }
};
