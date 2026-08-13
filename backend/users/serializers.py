from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
    )

    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone',
            'age',
            'gender',
        ]

        extra_kwargs = {
            'username': {
                'required': False,
                'allow_blank': True,
            },
            'first_name': {
                'required': True,
            },
            'last_name': {
                'required': True,
            },
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {
                    'confirm_password': 'Passwords do not match.'
                }
            )

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        # Public registration is always for participants.
        validated_data['role'] = 'participant'

        # Use email as username if username is not provided.
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']

        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'name', 'username', 'email', 'role', 'phone',
            'age', 'gender', 'first_name', 'last_name',
            'date_joined', 'is_active',
        ]
        read_only_fields = ['id', 'role', 'date_joined', 'is_active']

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.email


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 'phone', 'age', 'gender',
            'first_name', 'last_name',
        ]


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone',
            'age', 'gender', 'is_active', 'date_joined',
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
