import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  constraintApi,
  userApi,
  foodApi,
} from '../services/api';
import type {
  UserDietaryPreference,
  UserAllergy,
  UserFoodDislike,
  DietaryPattern,
  Food,
  UserConstraintsSummary,
} from '../types';

function Constraints() {
  const { userId } = useParams<{ userId: string }>();
  const [preferences, setPreferences] = useState<UserDietaryPreference[]>([]);
  const [allergies, setAllergies] = useState<UserAllergy[]>([]);
  const [dislikes, setDislikes] = useState<UserFoodDislike[]>([]);
  const [patterns, setPatterns] = useState<DietaryPattern[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [summary, setSummary] = useState<UserConstraintsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preferences' | 'allergies' | 'dislikes'>(
    'preferences'
  );

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [prefs, alls, disls, pats, foodList, summ] = await Promise.all([
        constraintApi.getDietaryPreferences(parseInt(userId)),
        constraintApi.getAllergies(parseInt(userId)),
        constraintApi.getFoodDislikes(parseInt(userId)),
        constraintApi.getDietaryPatterns(),
        foodApi.list(),
        userApi.getConstraintsSummary(parseInt(userId)),
      ]);
      setPreferences(prefs);
      setAllergies(alls);
      setDislikes(disls);
      setPatterns(pats);
      setFoods(foodList);
      setSummary(summ);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load constraints');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreference = async (patternId: number) => {
    if (!userId) return;
    try {
      await constraintApi.createDietaryPreference({
        user_id: parseInt(userId),
        pattern_id: patternId,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add dietary preference');
    }
  };

  const handleRemovePreference = async (id: number) => {
    try {
      await constraintApi.deleteDietaryPreference(id);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove dietary preference');
    }
  };

  const handleAddAllergy = async (data: {
    allergen_name: string;
    food_id?: number;
    severity: 'mild' | 'moderate' | 'severe';
  }) => {
    if (!userId) return;
    try {
      await constraintApi.createAllergy({
        user_id: parseInt(userId),
        ...data,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add allergy');
    }
  };

  const handleRemoveAllergy = async (id: number) => {
    try {
      await constraintApi.deleteAllergy(id);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove allergy');
    }
  };

  const handleAddDislike = async (foodId: number) => {
    if (!userId) return;
    try {
      await constraintApi.createFoodDislike({
        user_id: parseInt(userId),
        food_id: foodId,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add food dislike');
    }
  };

  const handleRemoveDislike = async (id: number) => {
    try {
      await constraintApi.deleteFoodDislike(id);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove food dislike');
    }
  };

  if (loading) {
    return (
      <div className="text-center">Loading constraints...</div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <Link
            to="/users"
            className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Dietary Constraints</h1>
          <p className="text-gray-600 mt-2">User ID: {userId}</p>
        </div>

        {summary && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Allowed Foods</div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.total_allowed_foods}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Excluded Foods</div>
                <div className="text-2xl font-bold text-red-600">
                  {summary.total_excluded_foods}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dietary Patterns</div>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.dietary_patterns.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Allergies</div>
                <div className="text-2xl font-bold text-gray-900">{summary.allergies.length}</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'preferences'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dietary Preferences
              </button>
              <button
                onClick={() => setActiveTab('allergies')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'allergies'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Allergies
              </button>
              <button
                onClick={() => setActiveTab('dislikes')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'dislikes'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Food Dislikes
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Dietary Preferences</h3>
                <div className="mb-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddPreference(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Add a dietary pattern...</option>
                    {patterns
                      .filter(
                        (p) => !preferences.some((pref) => pref.pattern.id === p.id)
                      )
                      .map((pattern) => (
                        <option key={pattern.id} value={pattern.id}>
                          {pattern.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {preferences.map((pref) => (
                    <div
                      key={pref.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span>{pref.pattern.name}</span>
                      <button
                        onClick={() => handleRemovePreference(pref.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'allergies' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Allergies</h3>
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Allergen name"
                    id="allergen-name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  <select
                    id="allergen-severity"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="moderate">Moderate</option>
                    <option value="mild">Mild</option>
                    <option value="severe">Severe</option>
                  </select>
                  <button
                    onClick={() => {
                      const nameInput = document.getElementById(
                        'allergen-name'
                      ) as HTMLInputElement;
                      const severitySelect = document.getElementById(
                        'allergen-severity'
                      ) as HTMLSelectElement;
                      if (nameInput.value) {
                        handleAddAllergy({
                          allergen_name: nameInput.value,
                          severity: severitySelect.value as 'mild' | 'moderate' | 'severe',
                        });
                        nameInput.value = '';
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add Allergy
                  </button>
                </div>
                <div className="space-y-2">
                  {allergies.map((allergy) => (
                    <div
                      key={allergy.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{allergy.allergen_name}</span>
                        {allergy.food && <span className="text-gray-500 ml-2">({allergy.food.name})</span>}
                        <span className="text-sm text-gray-500 ml-2 capitalize">
                          ({allergy.severity})
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveAllergy(allergy.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dislikes' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Food Dislikes</h3>
                <div className="mb-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddDislike(parseInt(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Add a food dislike...</option>
                    {foods
                      .filter((f) => !dislikes.some((d) => d.food.id === f.id))
                      .map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {dislikes.map((dislike) => (
                    <div
                      key={dislike.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span>{dislike.food.name}</span>
                      <button
                        onClick={() => handleRemoveDislike(dislike.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Constraints;

