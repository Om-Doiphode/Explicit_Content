#include <bits/stdc++.h>
using namespace std;
static bool cmp(pair<int, int> a, pair<int, int> b)
{
    return a.second < b.second;
}
vector<int> maxMeetings(int n, vector<int> &S, vector<int> &F)
{
    vector<pair<int, int>> v;
    map<pair<int, int>, int> hash;
    for (int i = 0; i < n; i++)
    {
        if (hash[{S[i], F[i]}] == 0)
            hash[{S[i], F[i]}] = i + 1;
        else
            hash[{S[i], F[i]}] = min(hash[{S[i], F[i]}], i + 1);
        v.push_back({S[i], F[i]});
    }

    sort(v.begin(), v.end(), cmp);

    int ansEnd = v[0].second;
    vector<int> result;
    result.push_back(hash[{v[0].first, v[0].second}]);

    for (int i = 1; i < n; i++)
    {
        if (v[i].first > ansEnd)
        {
            ansEnd = v[i].second;
            result.push_back(hash[{v[i].first, v[i].second}]);
        }
    }

    sort(result.begin(), result.end());

    return result;
}