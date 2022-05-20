import Hotel from "../models/Hotel.js";

export default async (req, res) => {
  let hotels = await Hotel.find({});

  let largeHotels = ["Rooms Hotel Tbilisi", "Stamba"];

  await Hotel.updateMany(
    {
      property: largeHotels,
    },
    {
      $set: {
        largeHotel: true,
      },
    },
    {
      strict: false,
    }
  );

  await res.render("hotels", {
    title: "Hotels",
    hotels,
  });
};
