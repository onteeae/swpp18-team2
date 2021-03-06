from django.test import TestCase, Client
from user.models import User
from interest.serializers import InterestSerializer
from article.tag import TagColor
from user.models import Department, College, User
import json
from .models import Interest, InterestTag

# Create your tests here.
class InterestTestCase(TestCase):
    def setUp(self):
        self.user = {'username': 'test@test.com', 'password': 'test'}
        self.notUser = {'username': 'test', 'password': 'test'}
        self.signup = {'password': 'test', 'nickName': 'signuptest',
                       'email': 'signup2@test.com', 'major': 1, 'studentId': 111323294, 'name': 'testSignup'}
        college = College.objects.create(name='college')
        department = Department.objects.create(name='department', college=college)
        tagColor = TagColor.objects.create(name='color', rgb='#ffffff')
        interestTag = InterestTag.objects.create(name='tag', color=tagColor)
        user = User.objects.create_user(email='test@test.com', password='test',
                                        studentId=98547514, major=department, name='test', nickName='test')
        anotherUser = User.objects.create_user(email='another@test.com', password='test',
                                               studentId=1548915, major=department, name='another', nickName='another')
        interest = Interest.objects.create(name='interest', createUser=user)
        anotherInterest = Interest.objects.create(name='interest1', createUser=anotherUser)
        secondInterest = Interest.objects.create(name='interest2', createUser=anotherUser)
        interest.tags.add(interestTag)
        anotherInterest.tags.add(interestTag)
        user.interests.add(interest)
        user.interests.add(anotherInterest)
        secondInterest.save()
        anotherInterest.save()
        anotherUser.interests.add(interest)
        anotherUser.interests.add(secondInterest)
        anotherUser.save()
        interest.save()
        user.save()


    def testBatch(self):
        response = self.client.get('/api/interest/batch/')
        self.assertEqual(response.status_code, 200)


    def testGetInterestTags(self):
        response = self.client.get('/api/interest/tags/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/tags/')
        self.assertEqual(response.status_code, 200)


    def testInterestRecommendation(self):
        response = self.client.get('/api/interest/recommend/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/recommend/')
        self.assertEqual(response.status_code, 200)

    def testInterestRecommendationByTag(self):
        response = self.client.get('/api/interest/recommend/tag/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/recommend/tag/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/interest/recommend/tag/',{'tags': '1'})
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/interest/recommend/tag/',{'tags': '1', 'limit' :1})
        self.assertEqual(response.status_code, 200)


    def testInterestRecommendationById(self):
        response = self.client.get('/api/interest/recommend/1/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/recommend/1/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/interest/recommend/100/')
        self.assertEqual(response.status_code, 404)

    def testToStr(self):
        interest = Interest.objects.get(pk = 1)
        self.assertEqual(interest.__str__(), 'interest')
        interestTag = InterestTag.objects.get(pk = 1)
        self.assertEqual(interestTag.__str__(), 'tag')

    def testCreatInterest(self):
        response = self.client.post('/api/interest/create/', json.dumps({'createUser': '1','name':'test','interestTags':'[5]'
                                                        ,'detail':'asd','photoURL':''}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.post('/api/interest/create/', json.dumps({'createUser': 1, 'name': 'test1', 'interestTags': [5]
                                                           , 'detail': 'asd', 'photoURL': ''}),
                                content_type='application/json')
        self.assertIn('test1',response.content.decode())
        response = self.client.post('/api/interest/create/', json.dumps({'createUser': 1, 'interestTags': [5]
                                                           , 'detail': 'asd', 'photoURL': ''}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response = self.client.post('/api/interest/create/', json.dumps({'createUser': 1, 'name': 'test2', 'interestTags': [5]
                                                           , 'detail': 'asd', 'photoURL': 'http://image.chosun.com/sitedata/image/201804/25/2018042502074_0.jpg'}),
                               content_type='application/json')
        self.assertIn('test2', response.content.decode())

    def testGetInterestByUser(self):

        response = self.client.get('/api/interest/user/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/user/')
        self.assertIn('interest',response.content.decode())

    def testGetInteresetById(self):
        response =self.client.get('/api/interest/1/')
        self.assertEqual(response.status_code, 400)
        self.client.login(username='test@test.com', password='test')
        response = self.client.get('/api/interest/1/')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/interest/3/', {'create': 'true'})
        self.assertEqual(response.status_code, 400)
        response = self.client.get('/api/interest/4/')
        self.assertEqual(response.status_code, 404)
