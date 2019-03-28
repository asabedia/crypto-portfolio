import pulp as plp
import random
import sys
import pandas as pd

random.seed(a=10)
# c = {(i): 10*i for i in range(1,11)} #original purchase price
# p = {(i): 10*i + random.randint(1,7) for i in range(1,11)} #predicted price
# B = 1000 # budget
# f = {(i): random.randint(1,10) for i in range(1,11)} # fraction
def get_optimal_quantities(y: {'coin name' : 'amount_held'}, x: ['coin names'], c: {'coin name' : 'cost'}, p : {'coin name' : 'current price'}, B : 'Int: budget', f : {'coin name': 'max fraction in portfolio'}) -> {'coin name': 'quantity'}:
    
    problem = plp.LpProblem("Crypto-currency porfolio", sense=plp.LpMaximize)
    x = {(i):plp.LpVariable(cat=plp.LpContinuous, name="x{0}".format(i)) for i in x}

    problem += plp.LpConstraint(
                 e=plp.lpSum(x[i] * p[i] for i in x),
                 sense=plp.LpConstraintLE,
                 rhs=B,
                 name="budget")
    for i in x:
        problem += plp.LpConstraint(
                    e=x[i],
                    sense=plp.LpConstraintLE,
                    rhs=(B*f[i]/100)/p[i],
                    name="limit_{0}".format(i))
        problem += plp.LpConstraint(
                    e=x[i],
                    sense=plp.LpConstraintGE,
                    rhs=-y[i],
                    name="amount_constraint{0}".format(i))

    objective = plp.lpSum(x[i] * (p[i]-c[i]) for i in x)
    problem.setObjective(objective)
    problem.solve()
    print(plp.LpStatus[problem.status])
    # opt_df = pd.DataFrame.from_dict(x, orient="index", columns = ["variable_object"])
    # opt_df["solution_value"] = opt_df["variable_object"].apply(lambda item: item.varValue)
    results = {i: x[i].varValue for i in x}
    
    return results

# print(get_optimal_quantities([i for i in range(1,10)],c,p,B,f))