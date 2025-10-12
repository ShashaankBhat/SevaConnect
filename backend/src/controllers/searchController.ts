import { Request, Response } from 'express';
import NGO from '../models/NGO';

interface SearchFilters {
  search?: string;
  category?: string;
  city?: string;
  state?: string;
  needs?: string[];
  maxDistance?: number; // in kilometers
  userLocation?: { lat: number; lng: number };
  sortBy?: 'distance' | 'name' | 'recent';
}

export const searchNGOs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      city,
      state,
      needs,
      maxDistance,
      userLocation,
      sortBy = 'name'
    }: SearchFilters = req.query;

    // Base query for verified NGOs only
    let query: any = { verificationStatus: 'verified' };

    // Text search across multiple fields
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filters
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }

    // Needs filter
    if (needs && needs.length > 0) {
      query.needs = { $in: needs };
    }

    // Distance-based filtering
    let aggregationPipeline: any[] = [
      { $match: query }
    ];

    // Add distance calculation if user location provided
    if (userLocation && userLocation.lat && userLocation.lng) {
      aggregationPipeline.push({
        $addFields: {
          distance: {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ['$location.lat', userLocation.lat] }, 2] },
                { $pow: [{ $subtract: ['$location.lng', userLocation.lng] }, 2] }
              ]
            }
          }
        }
      });

      // Filter by max distance (convert km to coordinate degrees approx)
      if (maxDistance) {
        const maxDistanceInDegrees = maxDistance / 111; // Rough conversion
        aggregationPipeline.push({
          $match: {
            distance: { $lte: maxDistanceInDegrees }
          }
        });
      }
    }

    // Sorting
    switch (sortBy) {
      case 'distance':
        if (userLocation) {
          aggregationPipeline.push({ $sort: { distance: 1 } });
        }
        break;
      case 'recent':
        aggregationPipeline.push({ $sort: { createdAt: -1 } });
        break;
      case 'name':
      default:
        aggregationPipeline.push({ $sort: { organizationName: 1 } });
        break;
    }

    // Projection to control returned fields
    aggregationPipeline.push({
      $project: {
        organizationName: 1,
        description: 1,
        address: 1,
        location: 1,
        category: 1,
        needs: 1,
        contact: 1,
        tags: 1,
        distance: 1,
        verificationStatus: 1
      }
    });

    const ngos = await NGO.aggregate(aggregationPipeline);

    res.json({
      ngos,
      totalCount: ngos.length,
      filters: {
        search,
        category,
        city,
        state,
        needs,
        maxDistance,
        sortBy
      }
    });
  } catch (error) {
    console.error('Search NGOs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSearchFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get distinct values for filters
    const categories = await NGO.distinct('category', { verificationStatus: 'verified' });
    const cities = await NGO.distinct('address.city', { verificationStatus: 'verified' });
    const states = await NGO.distinct('address.state', { verificationStatus: 'verified' });
    
    // Get common needs (appearing in at least 2 NGOs)
    const commonNeeds = await NGO.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $unwind: '$needs' },
      { $group: { _id: '$needs', count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const needs = commonNeeds.map(item => item._id);

    res.json({
      categories,
      cities,
      states,
      needs
    });
  } catch (error) {
    console.error('Get search filters error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
