import Observation from "../models/Observation.js";

/**
 * Create new observation
 */
export const createObservation = async (req, res) => {
  try {
    const observation = await Observation.create({
      ...req.body,
      createdBy: req.user.id,
      status: "pending",
    });

    res.status(201).json(observation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get approved observations (Public)
 */
export const getApprovedObservations = async (req, res) => {
  try {
    const data = await Observation.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all observations (Admin)
 */
export const getAllObservations = async (req, res) => {
  try {
    const data = await Observation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approve / Reject observation (Admin)
 */
export const updateObservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Observation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
